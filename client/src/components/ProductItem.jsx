import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
    return (
        <article className="productCard">
            <div className="productCard__imageWrap">
                <img className="productCard__image" src={product.image} alt={product.name} />
            </div>
            <div className="productCard__body">
                <div className="productCard__meta">
                    <span className="badge">{product.category}</span>
                    <span className="rating">Рейтинг: {product.rating ?? 0}</span>
                </div>
                <h2 className="productCard__title">{product.name}</h2>
                <p className="productCard__description">{product.description}</p>
                <div className="productCard__details">
                    <span>На складе: {product.stock}</span>
                    <span>{Number(product.price).toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="productCard__actions">
                    <button className="btn btn--secondary" onClick={() => onEdit(product)}>
                        Редактировать
                    </button>
                    <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                        Удалить
                    </button>
                </div>
            </div>
        </article>
    );
}
