import QuestionForm from "./QuestionForm"

const AddQuestion = () => {
  return (
    <section>
      <QuestionForm 
              mode="add"
              isLoading={false}
      />
    </section>
  )
}

export default AddQuestion
