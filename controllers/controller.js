import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";

import { setOneQuestions, answersSetOne } from '../database/setOne.js';
import { setTwoQuestions, answersSetTwo } from '../database/setTwo.js';
import { setThreeQuestions, answersSetThree } from '../database/setThree.js';

/** get questions based on roll number */
export async function getQuestions(req, res){
    try {
        const { rollNumber } = req.query; // Get roll number from query parameters
        const rollInt = parseInt(rollNumber.substring(9)) - 1; // Adjust for 0-indexed

        let set;
        if (rollInt % 3 === 0) {
            set = 'setOne';
        } else if (rollInt % 3 === 1) {
            set = 'setTwo';
        } else {
            set = 'setThree';
        }

        const questions = await Questions.findOne({ set });
        res.json(questions);
    } catch (error) {
        res.json({ error });
    }
}

/** insert all questions */
export async function insertQuestions(req, res){
    try {
        await Questions.insertMany([
            { set: 'setOne', questions: setOneQuestions, answers: answersSetOne },
            { set: 'setTwo', questions: setTwoQuestions, answers: answersSetTwo },
            { set: 'setThree', questions: setThreeQuestions, answers: answersSetThree }
        ]);
        res.json({ msg: "Data Saved Successfully...!"});
    } catch (error) {
        res.json({ error });
    }
}

/** Delete all Questions */
export async function dropQuestions(req, res){
   try {
        await Questions.deleteMany();
        res.json({ msg: "Questions Deleted Successfully...!"});
   } catch (error) {
        res.json({ error })
   }
}

/** get all result */
export async function getResult(req, res){
    try {
        const r = await Results.find();
        res.json(r)
    } catch (error) {
        res.json({ error })
    }
}

/** post all result */
export async function storeResult(req, res){
   try {
        const { username, result, attempts, points, achived } = req.body;
        if(!username && !result) throw new Error('Data Not Provided...!');

        Results.create({ username, result, attempts, points, achived }, function(err, data){
            res.json({ msg : "Result Saved Successfully...!"})
        })

   } catch (error) {
        res.json({error})
   }
}

/** delete all result */
export async function dropResult(req, res){
    try {
        await Results.deleteMany();
        res.json({ msg : "Result Deleted Successfully...!"})
    } catch (error) {
        res.json({ error })
    }
}