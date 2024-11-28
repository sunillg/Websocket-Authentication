import  { useState } from "react";
import { useSpring, animated } from "react-spring";
import "./Course.css";

interface Types {
  id: number;
  subtitle: string;
  title: string;
}

const Spring = () => {
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


  const selectedSpring = useSpring({
    opacity: selectedId !== null ? 1 : 0,
    scale: selectedId !== null ? 1 : 0,
  });

  return (
    <div className="container course-grid">
      {items.map((item) => (
        <animated.div
          key={item.id}
          onClick={() => setSelectedId(item.id)}
          className="item course-item"
        >
          <animated.h5>{item.subtitle}</animated.h5>
          <animated.h2>{item.title}</animated.h2>
        </animated.div>
      ))}

      {selectedId !== null && selectedItem && (
        <animated.div className="selected-course" style={selectedSpring}>
          <h5>{selectedItem.subtitle}</h5>
          <h2>{selectedItem.title}</h2>
          <button onClick={() => setSelectedId(null)}>Close</button>
        </animated.div>
      )}
    </div>
  );
};

export default Spring;
