package com.campuscore.controller;

import com.campuscore.dto.AIAnalysisResponse;
import com.campuscore.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Insights", description = "AI-powered academic analysis and predictions")
public class AIController {
    private final AIService aiService;

    @GetMapping("/analyze-student/{studentId}")
    @Operation(summary = "Analyze student performance and get predictive insights")
    public AIAnalysisResponse analyzeStudent(@PathVariable UUID studentId) {
        return aiService.analyzeStudentPerformance(studentId);
    }

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI for general queries")
    public String chat(@RequestBody String question) {
        return aiService.askAI(question);
    }
}
