import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PersonList from "./PersonList";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast , ToastContainer } from "react-toastify";

const addUserSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    gmail: yup.string().required("Email is required").required("@gmail.com").email("Enter a valid email"),
})

export function Chat() {
    const [user, setUser] = useState([
        {
            name : "Rauf",
            gmail: "rauf1@gmail.com",
            message: [
                { text: "Hello, how are you?", sender: true },
                { text: "I'm fine, what about you?", sender: false },
                { text: "I'm also fine, thanks!", sender: true },
                { text: "That's great to hear!", sender: false },
                { text: "Thanks for the conversation.", sender: false },
                { text: "You're welcome!", sender: false },
                { text: "Bye!", sender: true },
                { text: "See you later!", sender: false },
            ],
        },
        {
            name : "Ahmad",
            gmail: "rauf2@gmail.com",
            message: [],
        },
        {
            name : "Ali",
            gmail: "rauf3@gmail.com",
            message: [],
        },
    ]);

    // Data and hooks

    const location = useLocation();
    const { email } = location.state;
    const [selectedUser, setSelectedUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [addingUser, setAddingUser] = useState(false);
    const { register, handleSubmit , formState: { errors } } = useForm({
        resolver : yupResolver(
            addUserSchema
        ),
    });
    // Always get the latest selected user from state
    const currentUser = user.find((u) => u.gmail === selectedUser);

    // FUnctions

    const clickingUser = (user) => {
        setSelectedUser(user.gmail);
    };

    const sendMessage = () => {
        if (!socket || !selectedUser || message.trim() === "") {
            toast.error("Can't send an empty message");
            return;
        }

        socket.emit("send-message", {
            from: email,
            to: selectedUser,
            message,
        });

        // Update React state
        setUser((prevUsers) =>
            prevUsers.map((u) => {
                if (u.gmail !== selectedUser) return u;

                return {
                    ...u,
                    message: [
                        ...(u.message || []),
                        {
                            text: message,
                            sender: true,
                        },
                    ],
                };
            })
        );

        setMessage("");
    };

    useEffect(() => {
        const newSocket = io("http://localhost:3000", {
            withCredentials: true,
            auth: {
                email,
            },
        });

        newSocket.on("connect", () => {
            console.log("Connected:", newSocket.id);
        });

        newSocket.on("message", (data) => {
            console.log(data);
        });

        const receiveHandler = (data) => {
            console.log("Received:", data);
            const index = user.find((u) => u.gmail === data.gmail);
            if(!index) {
                setUser( [ ...user , { name : data.name || "Unknown" , gmail : data.gmail , message : [ { text : data.message , sender : false }] } ] )
            }
            setUser((prevUsers) =>
                prevUsers.map((u) => {
                    if (u.gmail !== data.from) return u;

                    return {
                        ...u,
                        message: [
                            ...(u.message || []),
                            {
                                text: data.message,
                                sender: false,
                            },
                        ],
                    };
                })
            );
        };

        newSocket.on("receive-message", receiveHandler);

        setSocket(newSocket);

        return () => {
            newSocket.off("receive-message", receiveHandler);
            newSocket.disconnect();
        };
    }, [email]);


    const addUser = () => {
        console.log("Add user has been called");
        setAddingUser(true);
        
    }

    const addUserForm = ( data ) => {
        user.map((u) => {
            if(u.gmail === data.gmail){
                console.log("User already exists");
                return;
            }
        })
        setUser( [...user , { name : data.name , gmail : data.gmail , message : [] }] );
        setAddingUser(false);
    }

    return (
        <>
        <ToastContainer />
        {
                addingUser && (
                    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <form
        onSubmit={handleSubmit(addUserForm)}
        className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl space-y-6"
    >
        <h1 className="text-3xl font-bold text-center text-white">
            Add User
        </h1>

        {/* Name */}
        <div>
            <label className="block text-gray-300 mb-2">
                Name
            </label>

            <input
                {...register("name")}
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                </p>
            )}
        </div>

        {/* Gmail */}
        <div>
            <label className="block text-gray-300 mb-2">
                Gmail
            </label>

            <input
                {...register("gmail")}
                type="email"
                placeholder="Enter your Gmail"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.gmail && (
                <p className="text-red-400 text-sm mt-1">
                    {errors.gmail.message}
                </p>
            )}
        </div>

        <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-3 rounded-lg font-semibold"
        >
            Submit
        </button>
    </form>
</div>
                )
            }

        <div className="h-full w-full flex flex-row justify-end">
            
            {/* Sidebar */}

            <div className="w-1/5 h-screen flex flex-col bg-slate-900 p-5 shadow-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6 border-b border-slate-700 pb-3">
                    👥 Users
                </h2>

                <ul className="space-y-3">
                    {user.map((u, index) => (
                        <PersonList
                            key={index}
                            object={u}
                            clickingUser={clickingUser}
                        />
                    ))}
                </ul>
                <button onClick={ () => addUser() } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" >Hit me</button>
            </div>

            {/* Chat Area */}

            <div className="w-4/5 h-screen bg-slate-800 p-5 overflow-y-auto flex flex-col">

                {currentUser ? (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-6">
                            Chatting with {currentUser.gmail}
                        </h2>

                        <div className="flex-1 overflow-y-auto space-y-4">
                            {currentUser.message?.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${
                                        msg.sender
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-600 text-gray-300"
                                    }`}
                                >
                                    <p
                                        className={
                                            msg.sender
                                                ? "text-right"
                                                : "text-left"
                                        }
                                    >
                                        {msg.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t bg-white p-4 mt-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendMessage();
                                        }
                                    }}
                                />

                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-lg"
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <h2 className="text-2xl font-bold text-white">
                            Select a user to start chatting
                        </h2>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default Chat;