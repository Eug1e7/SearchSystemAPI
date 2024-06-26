// Search-system\SearchSystemAPI\src\controllers\SearchController.ts

import { Request, Response, Router } from "express";
import { GetQuestionService } from "../services/GetQuestionService";
import { GetService } from "../services/GetService";
import { SearchService } from "../services/SearchService";
import { GetKeywordService } from "../services/GetKeywordService";

export const searchRouter = Router();

// 登録API
searchRouter.post("/search", async (req: Request, res: Response) => {
    const { question } = req.body;
    try {
        const searchService = new SearchService();
        const result = await searchService.performSearch(question);
        console.log(`Result: `, result);
        res.status(201).send(result.response);
    } catch (error) {
        console.error("Error in search:", error);
        res.status(500).send(error.message);
    }
});

// 検索履歴を取得
searchRouter.get("/history", async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, category } = req.query;
        const history = await GetService.getHistoryQuestions(startDate as string, endDate as string, category as string);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Score以上のtextを取得
searchRouter.get("/score_text", async (req: Request, res: Response) => {
    // クエリパラメータからスコアを取得し、数値に変換
    const score = parseInt(req.query.score as string, 10);

    // 数値変換が正常かつ数値であることを確認
    if (isNaN(score)) {
        return res.status(400).send("Score parameter is required and must be a number.");
    }

    try {
        const texts = await GetKeywordService.sortTextScore(score);
        res.status(200).send(texts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Score以上のtextを含むquestionを取得
searchRouter.get("/score_question", async (req: Request, res: Response) => {
    // クエリパラメータからスコアを取得し、数値に変換
    const score = parseInt(req.query.score as string, 10);

    // 数値変換が正常かつ数値であることを確認
    if (isNaN(score)) {
        return res.status(400).send("Score parameter is required and must be a number.");
    }

    try {
        const questions = await GetQuestionService.sortQuestionScore(score);
        res.status(200).send(questions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// keywordを含むquestionを取得
searchRouter.get("/question", async (req: Request, res: Response) => {
    // クエリパラメータからkeywordを取得
    const keyword = req.query.keyword as string;

    // keywordが存在するか確認
    if (!keyword) {
        return res.status(400).send("Keyword parameter is required.");
    }

    try {
        const questions = await GetService.getQuestions(keyword);
        res.status(200).send(questions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Score以上の重要度を取得
searchRouter.get("/importance_score", async (req: Request, res: Response) => {
    // クエリパラメータからハッシュを取得
    const hash = req.query.hash as string;

    try {
        const keywords = await GetService.sortByImportance(hash);
        res.status(200).send(keywords);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Score以上の理解度を含む質問を取得
searchRouter.get("/understanding_score", async (req: Request, res: Response) => {
    // クエリパラメータからハッシュを取得
    const hash = req.query.hash as string;

    try {
        const questions = await GetService.sortByUnderstanding(hash);
        res.status(200).send(questions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});