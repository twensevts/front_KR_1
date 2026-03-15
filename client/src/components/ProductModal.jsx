import React, { useEffect, useState } from 'react';

const initialForm = {
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    rating: '',
    image: '',
};

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!open) return;
        setForm({
            name: initialProduct?.name ?? '',
            category: initialProduct?.category ?? '',
            description: initialProduct?.description ?? '',
            price: initialProduct?.price != null ? String(initialProduct.price) : '',
            stock: initialProduct?.stock != null ? String(initialProduct.stock) : '',
            rating: initialProduct?.rating != null ? String(initialProduct.rating) : '',
            image: initialProduct?.image ?? '',
        });
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === 'edit' ? 'Редактирование товара' : 'Создание товара';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            id: initialProduct?.id,
            name: form.name.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            rating: form.rating === '' ? undefined : Number(form.rating),
            image: form.image.trim(),
        };

        if (!payload.name || !payload.category || !payload.description) {
            alert('Заполните название, категорию и описание');
            return;
        }

        if (!Number.isFinite(payload.price) || payload.price < 0) {
            alert('Введите корректную цену');
            return;
        }

        if (!Number.isFinite(payload.stock) || payload.stock < 0) {
            alert('Введите корректное количество на складе');
            return;
        }

        if (payload.rating !== undefined && (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 5)) {
            alert('Рейтинг должен быть от 0 до 5');
            return;
        }

        onSubmit(payload);
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" type="button" onClick={onClose} aria-label="Закрыть">
                        ×
                    </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input className="input" name="name" value={form.name} onChange={handleChange} autoFocus />
                    </label>
                    <label className="label">
                        Категория
                        <input className="input" name="category" value={form.category} onChange={handleChange} />
                    </label>
                    <label className="label">
                        Описание
                        <textarea className="input input--textarea" name="description" value={form.description} onChange={handleChange} />
                    </label>
                    <label className="label">
                        Цена
                        <input className="input" name="price" value={form.price} onChange={handleChange} inputMode="decimal" />
                    </label>
                    <label className="label">
                        Количество на складе
                        <input className="input" name="stock" value={form.stock} onChange={handleChange} inputMode="numeric" />
                    </label>
                    <label className="label">
                        Рейтинг
                        <input className="input" name="rating" value={form.rating} onChange={handleChange} inputMode="decimal" placeholder="Необязательно" />
                    </label>
                    <label className="label">
                        Ссылка на фото
                        <input className="input" name="image" value={form.image} onChange={handleChange} />
                    </label>
                    <div className="modal__footer">
                        <button className="btn btn--secondary" type="button" onClick={onClose}>
                            Отмена
                        </button>
                        <button className="btn btn--primary" type="submit">
                            {mode === 'edit' ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
