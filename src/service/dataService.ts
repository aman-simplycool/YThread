import { ServiceDataType } from "@/types/serviceData";

class DataService {
  private data: ServiceDataType = {}; // Initialize with empty array
  private listeners: ((data: ServiceDataType) => void)[] = [];

  getData(): ServiceDataType {
    return this.data;
  }

  setData(newData:ServiceDataType) {
    this.data = { ...this.data, ...newData };
    this.notifyListeners();
  }

  subscribe(listener: (data: ServiceDataType) => void) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (data: ServiceDataType) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.data));
  }
}

export const dataService = new DataService();
