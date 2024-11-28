import { AnimatePresence, motion } from "framer-motion";
import  { useState } from "react";
import "./Course.css";

interface Types {
  id: number;
  subtitle: string;
  title: string;
}
const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};


const CourseList = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const items: Types[] = [
    { id: 0, subtitle: "HTML 5", title: "HTML" },
    { id: 1, subtitle: "CSS 3", title: "CSS" },
    { id: 2, subtitle: "React for intermediate", title: "React" },
    { id: 3, subtitle: "Redux State Management", title: "Redux" },
    { id: 4, subtitle: "Angular for Beginners", title: "Angular" },
    { id: 5, subtitle: "Next.js Framework", title: "Next.js" },
    { id: 6, subtitle: "Refine.dev Framework", title: "Refine.dev" },
    { id: 7, subtitle: "Node.js Backend Development", title: "Node.js" },
    { id: 8, subtitle: "Express Framework", title: "Express" },
    { id: 9, subtitle: "Prisma ORM", title: "Prisma ORM" },
    { id: 10, subtitle: "MySQL Database", title: "MySQL" },
    { id: 11, subtitle: "Postgres Database", title: "Postgres SQL" },
  ];

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className=" container course-grid">
      {items.map((item) => (
        <motion.div
          key={item.id}
          onClick={() => setSelectedId(item.id)}
          className="course-item"
          whileHover={{ scale: 1.1, rotate: 0 }}
          variants={container}
          initial="hidden"
          animate="visible"
         
        >
          <motion.h5>{item.subtitle}</motion.h5>
          <motion.h2>{item.title}</motion.h2>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId !== null && selectedItem && (
          <motion.div className="selected-course"  
          variants={container}
          initial="hidden"
          animate="visible">
            <motion.h5>{selectedItem.subtitle}</motion.h5>
            <motion.h2>{selectedItem.title}</motion.h2>
            <motion.button onClick={() => setSelectedId(null)}>
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseList;


