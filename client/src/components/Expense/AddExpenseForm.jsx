import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) =>
        setExpense({ ...expense, [key]: value });

    const handleSubmit = () => {
        onAddExpense(expense);
    };

    return (
        <div className="p-2">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Icon
                </label>
                <EmojiPickerPopup
                    icon={expense.icon}
                    onSelect={(selectedIcon) =>
                        handleChange("icon", selectedIcon)
                    }
                />
            </div>

            <Input
                value={expense.category}
                onChange={({ target }) =>
                    handleChange("category", target.value)
                }
                label="Category"
                placeholder="Rent, Groceries, Utilities, etc."
                type="text"
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="Enter amount"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder="Select date"
                type="date"
            />

            <div className="flex gap-3 justify-end mt-8">
                <button
                    type="button"
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => {
                        setExpense({
                            category: "",
                            amount: "",
                            date: "",
                            icon: "",
                        });
                    }}
                >
                    Clear
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md shadow-red-500/20 transition-all"
                    onClick={handleSubmit}
                >
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;
