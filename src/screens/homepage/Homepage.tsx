import LoginScreen from "../auth/LoginScreen";

const Homepage = () => {
  const bgImage = require("../../asset/images/meristem_front_3.jpeg");

  return (
    <section className="w-full h-screen bg-green-950 ">
      <section className="w-full h-auto lg:h-[15vh]">
        <section className="flex flex-col items-center md:flex-row ">
          <img
            src={require("../../asset/images/meristem_name_logo.png")}
            alt=""
            className="bg-white w-[90px] h-[20px] lg:h-[40px] lg:w-[200px] rounded-xl shadow-md mt-4 animate-bounce"
          />
          <header className="lg:pl-[20vw] text-xl md:text-3xl lg:text-5xl text-center text-green-400 p-2 lg:p-8 ">
            Stock Brokers Ltd Workflow
          </header>
        </section>
        <p className="text-xs text-center text-gray-400 lg:pb-8 lg:pr-8 lg:text-right">
          22A Gerrard road, Ikoyi, Lagos State of Nigeria
        </p>
      </section>
      <section className="w-full h-[85vh] relative">
        <img src={bgImage} alt="" className="w-screen h-full opacity-40" />

        <p className="absolute hidden text-4xl text-white lg:flex z-100 top-36 left-16">
          Welcome to MSBL Workflow !
        </p>
        {/* <p className="absolute hidden text-4xl text-white lg:flex z-100 top-48 left-20 animate-spin animate-ping">
          a new world
        </p>
        <p className="absolute hidden text-4xl text-white lg:flex z-100 top-60 left-24 animate-spin animate-ping">
          of resolving and managing your client's expectation...
        </p> */}
        <p className="absolute hidden text-3xl text-green-500 duration-50 lg:flex z-100 top-48 left-24 ">
          ... a green world
        </p>
        <p className="absolute hidden text-2xl text-green-200 duration-50 lg:flex z-100 top-60 left-36 overflow-clip overflow-ellipsis">
          of resolving and managing your client's expectation
        </p>

        <LoginScreen />
      </section>
    </section>
  );
};

export default Homepage;
