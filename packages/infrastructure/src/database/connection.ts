import mongoose from 'mongoose';

export interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(config: DatabaseConfig): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        ...config.options
      };

      await mongoose.connect(config.uri, defaultOptions);
      
      this.isConnected = true;
      console.log('Database connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('Database connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Database disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('Database reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('Database not connected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const dbConnection = DatabaseConnection.getInstance(); 