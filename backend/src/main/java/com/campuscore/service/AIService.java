package com.campuscore.service;

import com.campuscore.dto.AIAnalysisResponse;
import com.campuscore.entity.Attendance;
import com.campuscore.entity.ExamResult;
import com.campuscore.repository.AttendanceRepository;
import com.campuscore.repository.ExamResultRepository;
import com.campuscore.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {
    private final ChatClient chatClient;
    private final StudentRepository studentRepository;
    private final ExamResultRepository examResultRepository;
    private final AttendanceRepository attendanceRepository;

    public AIAnalysisResponse analyzeStudentPerformance(UUID studentId) {
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<ExamResult> results = examResultRepository.findByStudentId(studentId);
        List<Attendance> attendance = attendanceRepository.findByStudentId(studentId);

        String context = String.format(
            "Student: %s, Roll Number: %s, Semester: %d\n" +
            "Academic Performance:\n%s\n" +
            "Attendance Record:\n%s",
            student.getUser().getFullName(),
            student.getRollNumber(),
            student.getSemester(),
            results.isEmpty() ? "No exam results yet." : results.stream().map(r -> String.format("- Subject: %s, Marks: %d/%d, Grade: %s", 
                r.getSubject().getName(), r.getMarksObtained(), r.getTotalMarks(), r.getGrade()))
                .collect(Collectors.joining("\n")),
            attendance.isEmpty() ? "No attendance records yet." : attendance.stream().map(a -> String.format("- Date: %s, Subject: %s, Status: %s", 
                a.getDate(), a.getSubject().getName(), a.getStatus()))
                .collect(Collectors.joining("\n"))
        );

        String analysis = chatClient.prompt()
                .user(String.format("Analyze the following student data and provide predictive insights on their performance, potential risks (like low attendance or failing grades), and actionable recommendations for improvement. Format the response in a professional manner with clear sections:\n\n%s", context))
                .call()
                .content();

        return new AIAnalysisResponse(analysis);
    }

    public String askAI(String question) {
        return chatClient.prompt()
                .user(question)
                .call()
                .content();
    }
}
