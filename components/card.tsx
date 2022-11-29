import card from "./card.module.scss";

export default function (props: {
  image: string,
  title: string,
  author: string,
  pageCount: string,
}) {
  return (
    <div className={card.card}>
      <img src={props.image} />
      <div className={card.card__title}>{props.title}</div>
      <div className={card.card__text}>{props.author}</div>
      <div className={card.card__text}>{props.pageCount} Halaman</div>
    </div>
  )
}