import {
    Home,
    About,
    Courses,
    Contact,
    Footer,
    Navbar,
    Teacher,
  } from "../components/index";
import ChatApp from "./chatboat";
import Recommendations from "./Recommendations";
  
const Template = ()=> {

  
    return (
      <div className=" font-Poppins bg-Solitude">
        <Navbar />
  
        <Home />
  
        <About />
    
        <Courses />
        <Teacher/>
        <Recommendations/>
        <ChatApp/>
       < Footer/>
  
      </div>
    );
  }
  
  export default Template;
  