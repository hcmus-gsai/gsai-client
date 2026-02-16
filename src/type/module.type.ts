export interface Module {
    id: string;
    course_id: string;
    module_name: string;
    module_description: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface ModuleResponse {
    modules: Module[];
    total: number;
}
