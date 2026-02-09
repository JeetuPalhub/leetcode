"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus,
    Trash2,
    Code2,
    FileText,
    Lightbulb,
    BookOpen,
    CheckCircle2,
    Download,
    AlertCircle,
    Save
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    constraints: z.string().min(1, "Constraints are required"),
    hints: z.string().optional().nullable(),
    editorial: z.string().optional().nullable(),
    companies: z.array(z.string()).optional(),
    testCases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
            })
        )
        .min(1, "At least one test case is required"),
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional().nullable(),
        }),
        PYTHON: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional().nullable(),
        }),
        JAVA: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional().nullable(),
        }),
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
        PYTHON: z.string().min(1, "Python code snippet is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
        PYTHON: z.string().min(1, "Python solution is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
});

const EditProblemForm = ({ initialData }) => {
    const navigate = useNavigate();
    const { updateProblem } = useProblemStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            ...initialData,
            companies: initialData.companies || [""],
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                companies: initialData.companies?.length > 0 ? initialData.companies : [""],
            });
        }
    }, [initialData, reset]);

    const {
        fields: testCaseFields,
        append: appendTestCase,
        remove: removeTestCase,
    } = useFieldArray({
        control,
        name: "testCases",
    });

    const {
        fields: tagFields,
        append: appendTag,
        remove: removeTag,
    } = useFieldArray({
        control,
        name: "tags",
    });

    const {
        fields: companyFields,
        append: appendCompany,
        remove: removeCompany,
    } = useFieldArray({
        control,
        name: "companies",
    });

    const onSubmit = async (value) => {
        try {
            setIsLoading(true);
            // Clean up empty companies if any
            const cleanedValue = {
                ...value,
                companies: value.companies?.filter(c => c.trim() !== "") || []
            };

            const success = await updateProblem(initialData.id, cleanedValue);
            if (success) {
                navigate("/");
            }
        } catch (error) {
            console.log("Error updating problem", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="card bg-base-100 shadow-xl border border-white/5">
                <div className="card-body p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b border-white/5">
                        <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Edit Problem: <span className="text-primary italic">{initialData.title}</span>
                        </h2>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Cancel</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("title")}
                                    placeholder="Enter problem title"
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.title.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-32 w-full p-4 resize-y"
                                    {...register("description")}
                                    placeholder="Enter problem description"
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.description.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">Difficulty</span>
                                </label>
                                <select className="select select-bordered w-full" {...register("difficulty")}>
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                            </div>
                        </div>

                        {/* Tags & Companies */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Tags */}
                            <div className="card bg-base-200 p-6 border border-white/5 shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" /> Tags
                                    </h3>
                                    <button type="button" className="btn btn-primary btn-sm rounded-xl" onClick={() => appendTag("")}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {tagFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input type="text" className="input input-bordered input-sm flex-1" {...register(`tags.${index}`)} />
                                            <button type="button" className="btn btn-ghost btn-circle btn-sm" onClick={() => removeTag(index)}>
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Companies */}
                            <div className="card bg-base-200 p-6 border border-white/5 shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-secondary" /> Companies
                                    </h3>
                                    <button type="button" className="btn btn-secondary btn-sm rounded-xl" onClick={() => appendCompany("")}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {companyFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input type="text" className="input input-bordered input-sm flex-1" {...register(`companies.${index}`)} />
                                            <button type="button" className="btn btn-ghost btn-circle btn-sm" onClick={() => removeCompany(index)}>
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="card bg-base-200 p-6 border border-white/5 shadow-inner">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Test Cases
                                </h3>
                                <button type="button" className="btn btn-success btn-sm rounded-xl text-white" onClick={() => appendTestCase({ input: "", output: "" })}>
                                    <Plus className="w-4 h-4" /> Add Test Case
                                </button>
                            </div>
                            <div className="space-y-4">
                                {testCaseFields.map((field, index) => (
                                    <div key={field.id} className="bg-base-100 p-4 rounded-xl shadow-sm border border-white/5 flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="label p-1 text-[10px] uppercase font-bold opacity-50">Input</label>
                                            <textarea className="textarea textarea-bordered w-full h-20 font-mono text-sm" {...register(`testCases.${index}.input`)} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="label p-1 text-[10px] uppercase font-bold opacity-50">Output</label>
                                            <textarea className="textarea textarea-bordered w-full h-20 font-mono text-sm" {...register(`testCases.${index}.output`)} />
                                        </div>
                                        <button type="button" className="btn btn-ghost btn-circle self-center" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1}>
                                            <Trash2 className="w-4 h-4 text-error" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Language Sections */}
                        <div className="space-y-8">
                            {["JAVASCRIPT", "PYTHON", "JAVA"].map(lang => (
                                <div key={lang} className="collapse collapse-arrow bg-base-200 border border-white/5">
                                    <input type="checkbox" defaultChecked={lang === "JAVASCRIPT"} />
                                    <div className="collapse-title text-xl font-bold flex items-center gap-3">
                                        <Code2 className="w-6 h-6 text-primary" /> {lang} Configuration
                                    </div>
                                    <div className="collapse-content space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-sm uppercase opacity-50 mb-2">Starter Code</h4>
                                                <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                    <Controller
                                                        name={`codeSnippets.${lang}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="250px"
                                                                language={lang.toLowerCase()}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{ minimap: { enabled: false }, fontSize: 13 }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm uppercase opacity-50 mb-2">Reference Solution (Validation)</h4>
                                                <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                    <Controller
                                                        name={`referenceSolutions.${lang}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="250px"
                                                                language={lang.toLowerCase()}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{ minimap: { enabled: false }, fontSize: 13 }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card bg-base-100 p-4 border border-white/5">
                                            <h4 className="font-bold text-sm uppercase opacity-50 mb-4">Example Display</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="form-control">
                                                    <label className="label-text font-semibold mb-2 ml-1">Example Input</label>
                                                    <textarea className="textarea textarea-bordered h-20" {...register(`examples.${lang}.input`)} />
                                                </div>
                                                <div className="form-control">
                                                    <label className="label-text font-semibold mb-2 ml-1">Example Output</label>
                                                    <textarea className="textarea textarea-bordered h-20" {...register(`examples.${lang}.output`)} />
                                                </div>
                                                <div className="form-control">
                                                    <label className="label-text font-semibold mb-2 ml-1">Explanation</label>
                                                    <textarea className="textarea textarea-bordered h-20" {...register(`examples.${lang}.explanation`)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Metadata */}
                        <div className="card bg-base-200 p-6 border border-white/5 shadow-inner">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-warning">
                                <Lightbulb className="w-5 h-5" /> Advanced Metadata
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="form-control">
                                    <label className="label font-bold text-sm opacity-50">CONSTRAINTS</label>
                                    <textarea className="textarea textarea-bordered h-24 p-4" {...register("constraints")} />
                                </div>
                                <div className="form-control">
                                    <label className="label font-bold text-sm opacity-50">HINTS (AI COMPATIBLE)</label>
                                    <textarea className="textarea textarea-bordered h-24 p-4" {...register("hints")} />
                                </div>
                                <div className="form-control">
                                    <label className="label font-bold text-sm opacity-50">PLATFORM EDITORIAL</label>
                                    <textarea className="textarea textarea-bordered h-24 p-4" {...register("editorial")} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                            <button type="button" className="btn btn-ghost px-8" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-lg gap-2 px-12 rounded-2xl shadow-xl shadow-primary/20" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <><Save className="w-5 h-5" /> Update Problem</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Add missing lucide-react import Building2
import { Building2 } from "lucide-react";

export default EditProblemForm;
