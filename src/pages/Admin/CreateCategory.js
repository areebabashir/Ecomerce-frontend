import React, { useEffect, useState } from "react";
import Layout from "../../component/Layout/Layout";
import AdminMenu from "../../component/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../component/Form/CategoryForm";
import { Modal } from "antd";
import { verifyToken } from "../Auth/verifyToken.js"


const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const { token } = verifyToken()
    //handle Form
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     console.log(name)
    //     try {
    //         const { data } = await axios.post("/api/v1/category/create-category",
    //         formData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/form-data',
    //             },
    //         });
    //         if (data?.success) {
    //             toast.success(`${name} is created`);
    //             getAllCategory();
    //         } else {
    //             toast.error(data.message);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong in input form");
    //     }

    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name);

        try {
            const { data } = await axios.post(
                "/api/v1/category/create-category", {name}
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (data?.success) {
                console.log(`${name} is created`);
                toast.success(`${name} is created`);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong in input form");
        }
    };


    //get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-categories");
            
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    //update category
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `/api/v1/category/update-category/${selected._id}`,
                { name: updatedName },
                {
                headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },
            }
            );
            if (data.success) {
                toast.success(`${updatedName} is updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    //delete category
    const handleDelete = async (pId) => {
        try {
            const { data } = await axios.delete(
                `/api/v1/category/delete-category/${pId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (data.success) {
                toast.success(`Category is deleted`);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout title={"Dashboard - Create Category"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Category</h1>
                        <div className="p-3 w-50">
                            <CategoryForm
                                handleSubmit={handleSubmit}
                                value={name}
                                setValue={setName}
                            />
                        </div>
                        <div className="w-75">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.map((c) => (
                                        <tr key={c._id}>
                                            <td>{c.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary ms-2"
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setUpdatedName(c.name);
                                                        setSelected(c);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => handleDelete(c._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            visible={visible}
                        >
                            <CategoryForm
                                value={updatedName}
                                setValue={setUpdatedName}
                                handleSubmit={handleUpdate}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateCategory;
