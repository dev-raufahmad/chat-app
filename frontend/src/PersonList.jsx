const PersonList = ({ object , clickingUser }) => {
  return (
    <div onClick={() => clickingUser(object)} className="w-full max-w-sm mx-auto mb-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/20 cursor-pointer">
        <p className="text-center text-lg font-semibold text-white tracking-wide">
          {object.name}
        </p>
      </div>
    </div>
  );
};

export default PersonList;