export const makeHabitCategoryText = (text: string) => {
    if (text) {
        let tempText = text.split('-');

        const newArray = tempText.map((item) => {
            let firstLetter = item[0].toUpperCase();
            let remainedLetters = item.slice(1);

            return firstLetter + remainedLetters;
        })

        return newArray.join(' ')
    }
}

export const getFormatedDate = (date) => {
    if (!date) return null;
    
    const currentDate:any = new Date(date);
    return currentDate.toLocaleString("en-US", {
        month: "short", // "Jan", "Feb", "Mar", ...
        day: "numeric"  // 1–31
    });
}