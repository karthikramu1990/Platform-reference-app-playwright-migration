// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 11-01-23    ATK        PLAT-2689   Dynamic Load by BIM Disciplines
// -------------------------------------------------------------------------------------

export const getSubstringIgnoringNumbersAndSpecialChars = (str) => {
    // Remove numbers and special characters from the string using regex
    let cleanString = str.replace(/[^a-zA-Z]/g, "");
    
    // Return the cleaned string
    return cleanString;
}

export const getNumberArrayFromStringArray = (stringArray) => {
    return stringArray.map(Number);
}

//   let str = "Hello#%World123!";
//   let substring = getSubstringIgnoringNumbersAndSpecialChars(str);
//   console.log(substring);
  