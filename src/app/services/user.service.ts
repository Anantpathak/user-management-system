import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addUser(user: User): void {
    const users = this.getUsers();
    user.id = new Date().getTime();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers().map(user =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );
    this.saveUsers(users);
  }

  deleteUser(userId: number): void {
    const users = this.getUsers().filter(user => user.id !== userId);
    this.saveUsers(users);
  }

  sortByName(users: User[]): User[] {
    return users.sort((a, b) => a.name.localeCompare(b.name)); // Locale-aware sorting
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}