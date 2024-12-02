import courses from "./components/Course"

const Course = (props) => {

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
  )
}

const App = () => {

  return (
    <div>
      <Course course={courses} />
    </div>
  )
}

export default App;
