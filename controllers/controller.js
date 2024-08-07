import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";

import { setOneQuestions, answersSetOne } from '../database/setOne.js';
import { setTwoQuestions, answersSetTwo } from '../database/setTwo.js';
import { setThreeQuestions, answersSetThree } from '../database/setThree.js';

/** Get questions based on roll number */
export async function getQuestions(req, res) {
    try {
        const { rollNumber } = req.query; // Get roll number from query parameters

        // Default to setOne if rollNumber is not provided
        const rollInt = rollNumber ? parseInt(rollNumber.slice(-3)) - 1 : 0;

        let set;
        if (rollInt % 3 === 0) {
            set = 'setOne';
        } else if (rollInt % 3 === 1) {
            set = 'setTwo';
        } else {
            set = 'setThree';
        }

        console.log("Querying set:", set); // debug

        const questions = await Questions.findOne({ set });
        console.log("Found questions:", questions); // Additional debugging statement
    
        if (!questions) return res.status(404).json({ error: "Questions not found" });

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching questions" });
    }
}

/** Insert all questions */
export async function insertQuestions(req, res) {
    try {
        await Questions.insertMany([
            { set: 'setOne', questions: setOneQuestions, answers: answersSetOne },
            { set: 'setTwo', questions: setTwoQuestions, answers: answersSetTwo },
            { set: 'setThree', questions: setThreeQuestions, answers: answersSetThree }
        ]);
        res.status(201).json({ msg: "Data Saved Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while inserting questions" });
    }
}

/** Delete all Questions */
export async function dropQuestions(req, res) {
    try {
        await Questions.deleteMany();
        res.json({ msg: "Questions Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

/** Get all results */
export async function getResult(req, res) {
    try {
        const results = await Results.find();
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

/** Post all results */
export async function storeResult(req, res) {
    try {
        const { username, result, attempts, points, achieved } = req.body;
        if (!username || !result) throw new Error('Data Not Provided');

        await Results.create({ username, result, attempts, points, achieved });
        res.status(201).json({ msg: "Result Saved Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

/** Delete all results */
export async function dropResult(req, res) {
    try {
        await Results.deleteMany();
        res.json({ msg: "Results Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}