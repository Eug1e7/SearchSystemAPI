// Search-system\SearchSystemAPI\src\services\GetService.ts

import { KeyWordRepository } from "../repositories/KeyWordRepository";
import { SearchRepository } from "../repositories/SearchRepository";
import { UnderstandRepository } from "../repositories/UnderstandRepository";

// データ取得のロジックを記述
export class GetService {
    // 検索履歴を取得
    static async getHistoryQuestions(startDate?: string, endDate?: string, category?: string) {
        return SearchRepository.findAllFiltered(startDate, endDate, category).catch(error => {
            console.error("Error getting data:", error);
            throw new Error("Error getting history questions");
        });
    }

    // スコア以上のhashを取得し、重複を排除
    static async getScoreHash(score: number): Promise<string[]> {
        try {
            const hashes = await SearchRepository.findHashes(score);
            if (hashes.length === 0) {
                console.log("No hashes found for the given score.");
                return [];
            }

            // Setを使用して重複を排除し、再び配列に変換
            const uniqueHashes = Array.from(new Set(hashes));
            return uniqueHashes;
        } catch (error) {
            console.error("Error getting data:", error);
            return [];
        }
    }

    // score以上のtextを取得&重複を排除
    static async getScoreText(score: number): Promise<string[]> {
        try {
            const texts = await SearchRepository.findTexts(score);
            if (texts.length === 0) {
                console.log("No texts found for the given score.");
                return [];
            }

            // Setを使用して重複を排除し、再び配列に変換
            const uniqueTexts = Array.from(new Set(texts));
            return uniqueTexts;
        } catch (error) {
            console.error("Error getting data:", error);
            return [];
        }
    }

    // hashに対応するQuestionを取得
    static async getScoreQuestions(hashes: string[]): Promise<string[]> {
        try {
            const Question = await SearchRepository.findQuestions(hashes);
            return Question;
        } catch (error) {
            console.error("Error getting data:", error);
        }
    }

    // keywordを含むquestionを取得
    static async getQuestions(keyword: string): Promise<string[]> {
        // keywordからhashを取得
        const hashes = await SearchRepository.findHashesByKeyword(keyword);
        // 重複を排除
        const uniqueHashes = Array.from(new Set(hashes));

        // hashからquestionを取得
        const questions = await SearchRepository.findQuestions(uniqueHashes);
        return questions;
    }

    // hashに基づき、重要度（score）でソートされたキーワードデータを取得
    static async sortByImportance(hash: string): Promise<any[]> {
        try {
            // KeyWordRepositoryを使用してデータを取得
            const keywords = await KeyWordRepository.findByHashSortedByScore(hash);
            return keywords;
        } catch (error) {
            console.error("Error getting importance sorted data:", error);
            throw new Error("Error getting sorted by importance data");
        }
    }

    // hashに基づき、理解度（understandingScore）でソートされたデータを取得
    static async sortByUnderstanding(hash: string): Promise<any[]> {
        try {
            // UnderstandRepositoryを使用してデータを取得
            const understands = await UnderstandRepository.findByHashSortedByUnderstandingScore(hash);
            return understands;
        } catch (error) {
            console.error("Error getting understanding sorted data:", error);
            throw new Error("Error getting sorted by understanding data");
        }
    }
}
