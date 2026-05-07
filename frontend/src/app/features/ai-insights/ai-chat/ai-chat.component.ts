import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AIService } from '../ai.service';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  time: Date;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    TextFieldModule
  ],
  templateUrl: './ai-chat.component.html',
  styles: [`
    :host { display: block; height: 100%; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
  `]
})
export class AIChatComponent {
  private aiService = inject(AIService);
  
  messages: Message[] = [
    { text: 'Hello! I am your CampusCore AI Assistant, powered by OpenRouter. I have access to student performance and attendance data. How can I help you analyze reports or predict outcomes today?', sender: 'ai', time: new Date() }
  ];
  userInput = '';
  loading = false;

  sendMessage() {
    if (!this.userInput.trim() || this.loading) return;

    const userText = this.userInput;
    this.messages.push({ text: userText, sender: 'user', time: new Date() });
    this.userInput = '';
    this.loading = true;

    this.aiService.chat(userText).subscribe({
      next: (res) => {
        this.messages.push({ text: res, sender: 'ai', time: new Date() });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ text: 'I encountered an issue connecting to OpenRouter. Please ensure the backend is running and the OPENROUTER_API_KEY is configured.', sender: 'ai', time: new Date() });
        this.loading = false;
      }
    });
  }
}
