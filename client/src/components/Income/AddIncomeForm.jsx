import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    const handleSubmit = () => {
        onAddIncome(income);
    };

    return (
        <div className="p-2">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Icon
                </label>
                <EmojiPickerPopup
                    icon={income.icon}
                    onSelect={(selectedIcon) =>
                        handleChange("icon", selectedIcon)
                    }
                />
            </div>

            <Input
                value={income.source}
                onChange={({ target }) => handleChange("source", target.value)}
                label="Income Source"
                placeholder="Freelance, Salary, Investment, etc."
                type="text"
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="Enter amount"
                type="number"
            />

            <Input
                value={income.date}
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
                        setIncome({
                            source: "",
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
                    className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md shadow-orange-500/20 transition-all"
                    onClick={handleSubmit}
                >
                    Add Income
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;
