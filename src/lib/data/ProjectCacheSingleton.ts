import { exists } from "@tauri-apps/api/fs"
import type { ProjectCache } from "../models/Cache"
import type { Project } from "../models/Project"

export class ProjectCacheSingleton {
    public projects: Array<ProjectCache>
    private static _instance: ProjectCacheSingleton

    private constructor() {
        let data: string | null = localStorage.getItem("ProjectCacheSingleton")

        if (data === null)  {
            this.projects = new Array<ProjectCache>()
        } else {
            let parsedData: any = JSON.parse(data)

            parsedData.forEach((element: any) => {
                element.date = new Date(element.date)
            });

            this.projects = parsedData
        }
    }

    public static GetInstance(): ProjectCacheSingleton {
        if (!ProjectCacheSingleton._instance) ProjectCacheSingleton._instance = new ProjectCacheSingleton()
        return ProjectCacheSingleton._instance
    }

    public Write(project: Project): void {
        let hit: boolean = false

        this.projects.forEach(element => {
            if (element.path === project.path) {
                element.name = project.name
                element.date = new Date()
                element.results = project.data.postprocessor.length
                hit = true
            }
        })

        if (!hit && project.path !== null) {
            this.projects.push({
                name: project.name,
                path: project.path,
                date: new Date(),
                results: project.data.postprocessor.length
            })
        }

        localStorage.setItem("ProjectCacheSingleton", JSON.stringify(this.projects))
    }

    public async Refresh(): Promise<void> {
        let data: string | null = localStorage.getItem("ProjectCacheSingleton")

        if (data !== null)  {
            this.projects = JSON.parse(data)
        }

        let clearedCache: Array<ProjectCache> = []

        for(let i = 0; i < this.projects.length; i++) {
            await exists(this.projects[i].path).then((v) => {
                if (v) {
                    clearedCache.push(this.projects[i])
                }
            }).catch((e) => {
                
            })
        }

        this.projects = clearedCache

        localStorage.setItem("ProjectCacheSingleton", JSON.stringify(this.projects))
    }
}