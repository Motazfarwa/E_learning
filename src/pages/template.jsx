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
  
const Template = ()=> {

  
    return (
      <div className=" font-Poppins bg-Solitude">
        <Navbar />
  
        <Home />
  
        <About />
    
        <Courses />
        <Teacher/>
        <ChatApp/>
       < Footer/>
  
      </div>
    );
  }
  
  export default Template;
  