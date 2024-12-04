const Course = (props) => {
  console.log("what is it", props.course[0]);

  const total = props.course[0].parts.reduce(
    (a, parts) => a + parts.exercises,
    0
  )
  const total1 = props.course[1].parts.reduce((a,parts) => a+parts.exercises,0)

  return (
    <>
      <h1>{props.course[0].name}</h1>
      <p>
        {props.course[0].parts[0].name} {props.course[0].parts[0].exercises}
      </p>
      <p>
        {props.course[0].parts[1].name} {props.course[0].parts[1].exercises}
      </p>
      <p>
        {props.course[0].parts[2].name} {props.course[0].parts[2].exercises}
      </p>
      <p>
        {props.course[0].parts[3].name} {props.course[0].parts[3].exercises}
      </p>
      <b>total of {total} exercises</b>

      <h1>{props.course[1].name}</h1>
      <p>
        {props.course[1].parts[0].name} {props.course[1].parts[0].exercises}
      </p>
      <p>
        {props.course[1].parts[1].name} {props.course[1].parts[1].exercises}
      </p>
      <b>total of {total1} exercises</b>
    </>
  );
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <div>
      <Course course={courses} />
    </div>
  );
};

export default App;
