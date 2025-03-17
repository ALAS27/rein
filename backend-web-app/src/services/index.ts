import { UserModel } from '../models'; // Example model import

export const getAllUsers = async () => {
    return await UserModel.find(); // Example function to get all users
};

export const getUserById = async (id: string) => {
    return await UserModel.findById(id); // Example function to get a user by ID
};

export const createUser = async (userData: any) => {
    const user = new UserModel(userData);
    return await user.save(); // Example function to create a new user
};

export const updateUser = async (id: string, userData: any) => {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true }); // Example function to update a user
};

export const deleteUser = async (id: string) => {
    return await UserModel.findByIdAndDelete(id); // Example function to delete a user
};