import { FigureSelect } from "./fields.js";
import { aboutProgram, aboutAthor } from './info.js'



const aboutProgramButton = document.getElementById("ProgramBtn");
const aboutAthorButton = document.getElementById("AuthorBtn");
const undoButton = document.getElementById("UndoBtn");
const resetButton = document.getElementById("ResetBtn");

aboutAthorButton.addEventListener('click', aboutAthor);
aboutProgramButton.addEventListener('click', aboutProgram);
resetButton.addEventListener('click', reset);
undoButton.addEventListener('click', undo);


