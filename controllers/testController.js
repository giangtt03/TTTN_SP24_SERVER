const mongoose = require('mongoose');
const Test = require('../models/Test');
const Question = require('../models/question');
const Category = require('../models/Category');

module.exports = {
    renderQuestionList: async (req, res) => {
        try {
            const questions = await Question.find();
            const categories = await Category.find();
            res.render('test/createTest', { questions, categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getQuestionsByCategory: async (req, res) => {
        try {
            const { categoryId } = req.query;
            const categoryQuestions = await Question.find({ category: categoryId });
            res.json(categoryQuestions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createTest: async (req, res) => {
        try {
            const { name, category, questions } = req.body;
            console.log("question: ", questions);
    
            // Lặp qua mảng các câu hỏi và truy vấn từng câu hỏi để lấy ObjectId
            const selectedQuestions = [];
            for (const question of questions) {
                const foundQuestion = await Question.findOne({ content: question });
                if (foundQuestion) {
                    selectedQuestions.push(foundQuestion._id);
                }
            }
    
            const newTest = new Test({
                name,
                category,
                questions: selectedQuestions,
            });
            const savedTest = await newTest.save();
            res.json(savedTest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
     
    getTestById: async (req, res) => {
        try {
            const { id } = req.params;
            const test = await Test.findById(id).populate('questions');
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllTests: async (req, res) => {
        try {
            const tests = await Test.find().populate({
                path: 'questions',
                populate: {
                    path: 'answers' // Populate cả trường answers trong questions
                }
            }).populate('category');
            const user = req.session.user;
            res.render('test/getAllTests', { tests, user }); // Trả về template getAllTests.ejs với dữ liệu tests đã được populate đầy đủ
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    updateTest: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, questions } = req.body;
            const updatedTest = await Test.findByIdAndUpdate(
                id,
                { name, category, questions },
                { new: true }
            ).populate('questions');
            if (!updatedTest) {
                return res.status(404).json({ message: 'Test not found' });
            }
            res.json(updatedTest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // deleteTest: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         await Test.findByIdAndDelete(id);
    //         res.json({ message: 'Test deleted successfully' });
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }
};