import React, { useEffect, useState } from "react";
import { useSpring, animated, useTrail } from "@react-spring/web";
import "./Employee.css";
import axios from "axios";
import { Italic } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  tech: string[];
}

const Employee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = () => {
      try {
        setTimeout(async() => {
          const response = await axios.get("http://localhost:3000/api/employees");
        const datas = response.data.employees;
        
        setEmployees(datas); 
        setLoading(false);
        }, 500);
        
        
      } catch (error) {
        console.error("Error from Axios:", error);
      }
    };
    
    fetchEmployees();
  }, []);

  const len = employees.length;

  const trail = useTrail(len, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
  });

  const headingSpring = useSpring({
    from: { opacity: 0, transform: "scale(1)" },
    to: { opacity: 1, transform: "scale(1.1)" },
    config: { duration: 3000 },
  });

  if (loading) return <center style={{marginTop: 300}}><p>Loading...</p></center>;

  return (
    <>
      <center className="heading">
        <animated.h1 style={headingSpring}>Employee Details</animated.h1>
      </center>
      <div className="container course-grid ">
        {trail.map((style, index) => (
          <animated.div key={employees[index].id} style={style}>
            <EmployeeItem employee={employees[index]} />
          </animated.div>
        ))}
      </div>
    </>
  );
};

const EmployeeItem = ({ employee }: { employee: Employee }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const hoverAnimation = useSpring({
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? "translateY(30px)" : "translateY(10px)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <div
      className="course-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     {!isHovered ?<center style={{margin:40}}> <h2>{employee.name}</h2> </center> :
      <animated.div style={hoverAnimation} className="description">
        {/* <p>{employee.email}</p> */}
        <h5>{employee.name}</h5>
        <h6 style={{color:"black", fontStyle:"Italic"}}>{employee.role }</h6>
        <p style={{color:"black"}}>{employee.tech.join(", ")}</p>
      </animated.div>}
    </div>
  );
};

export default Employee;
