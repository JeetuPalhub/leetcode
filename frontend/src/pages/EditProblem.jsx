import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import EditProblemForm from "../components/EditProblemForm";

const EditProblem = () => {
    const { id } = useParams();
    const { problem, getProblemById, isProblemLoading } = useProblemStore();

    useEffect(() => {
        if (id) {
            getProblemById(id);
        }
    }, [id, getProblemById]);

    if (isProblemLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold text-error">Problem not found</h2>
            </div>
        );
    }

    return <EditProblemForm initialData={problem} />;
};

export default EditProblem;
