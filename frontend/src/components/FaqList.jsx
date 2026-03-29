function FaqList({ items, className = '' }) {
  return (
    <div className={`faq-list ${className}`.trim()}>
      {items.map((item, index) => (
        <details className="faq-item" id={item.id} key={item.id} open={index === 0}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export default FaqList
