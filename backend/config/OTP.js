const arr = [];


const add = (data, otp) => {

    arr.push({
        email: data.email,
        otp: otp
    });
    return true;

}


const contain = (data) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].email == data.email) {
            return arr[i];
        }
    }
    return false;
}


const remove = (data) => {
    if(arr.length == 0) return false;
    if(arr.length == 1 && arr[0].email == data.email){
        arr.pop();
        return true;
    }
    if(arr[arr.length-1].email == data.email){
        arr.pop();
        return true;
    }
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].email == data.email) {
            index = i;
            break;
        }
    }
    console.log("The data to be remove from the arr is : ", DataTransfer);

    console.log("The array before removing the data is : ", arr);

    arr = [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];
    console.log("The array after removing the data is : ", arr);
}

const validate = ( data , otp ) => {
    for(let i=0;i<arr.length;i++){
        if(arr[i].email == data.email && data.otp == otp){
            return true;
        }
    }
    return false;
}

module.exports = { add, remove, contain , validate }