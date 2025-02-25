import {
    Home,
    About,
    Courses,
    Contact,
    Footer,
    Navbar,
    Teacher,
  } from "../components/index";
  
const Template = ()=> {
    return (
      <div className=" font-Poppins bg-Solitude">
        <Navbar />
  
        <Home />
  
        <About />
    
        <Courses />
       < Teacher/>
  
       < Footer/>
  
      </div>
    );
  }
  
  export default Template;
  