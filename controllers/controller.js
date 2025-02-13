import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";
import questions, { answers } from '../database/data.js'
import User from '../models/userModel.js';
import Result from '../models/resultSchema.js';

/** get all questions */
export async function getQuestions(req, res){
    try {
        const q = await Questions.find();
        res.json(q)
    } catch (error) {
        res.json({ error })
    }
}

/** insert all questinos */
export async function insertQuestions(req, res){
    try {
        Questions.insertMany({ questions, answers }, function(err, data){
            res.json({ msg: "Data Saved Successfully...!"})
        })
    } catch (error) {
        res.json({ error })
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

/**
 * Helper function to get year pattern based on year input
 */
const getYearPattern = (year) => {
    if (year === '2') {
        return '^160923';  // 2nd year students have rollNo starting with 160923
    } else if (year === '3') {
        return '^160922';  // 3rd year students have rollNo starting with 160922
    }
    return '';  // Return empty string for invalid years
};

// Get results by branch, year, and optionally section
export const getResultsByBranchYearAndOptionalSection = async (req, res) => {
    try {
        const { branch, year, section } = req.params;

        // Convert branch input to lowercase for consistent comparison
        const formattedBranch = branch.toLowerCase();

        // Define the year prefix based on year (2nd year = "160923", 3rd year = "160922")
        let yearPrefix;
        if (year === '2') {
            yearPrefix = '160923';
        } else if (year === '3') {
            yearPrefix = '160922';
        } else {
            return res.status(400).json({ message: 'Invalid year provided' });
        }

        // Base query to match branch and year prefix in roll number
        let query = {
            Branch: { $regex: new RegExp(`^${formattedBranch}$`, 'i') },
            rollNo: { $regex: `^${yearPrefix}` },
        };

        // If section is provided, add section to the query
        if (section) {
            query.Section = { $regex: new RegExp(`^${section}$`, 'i') };
        }

        // Find the matching users based on branch, year, and optionally section
        const users = await User.find(query);

        // Get roll numbers of the matched users
        const rollNos = users.map(user => user.rollNo);

        // Fetch the results for those roll numbers from the Result model
        const results = await Result.find({ username: { $in: rollNos } });

        // Map the user data and result data into the required format
        const responseData = users.map(student => {
            const result = results.find(r => r.username === student.rollNo);
            
            // If no result found for the student, return null
            if (!result) return null;

            // Structure the response data for each student
            return {
                firstName: student.firstName,
                lastName: student.lastName,
                rollNo: student.rollNo,
                branch: student.Branch,
                section: student.Section,
                // result: result.result.filter(item => !Array.isArray(item)),  // Filtering out nested arrays
                points: result.points,
                achieved: result.achived,
                createdAt: result.createdAt
            };
        }).filter(data => data !== null);  // Filter out null values where no results were found

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error });
    }
};
