<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    import { onMount } from 'svelte';
    import Modal from '../components/Modal.svelte';
    import { ArticleType, type Article } from '../lib/models/Article';

    let selectedTab: number = 0
    let articles: Article[] = []
    let isArticleModalOpen: boolean = false
    let openArticleName: string = ""
    let openArticleContent: string = ""

    onMount(async () => {
        let guides = await window.electronAPI.readdir("./articles/guides")
        let troubleshooting = await window.electronAPI.readdir("./articles/troubleshooting")

        guides.forEach(element => {
            articles.push({name: element.split(".")[0], type: ArticleType.GUIDE})
        });

        troubleshooting.forEach(element => {
            articles.push({name: element.split(".")[0], type: ArticleType.TROUBLESHOOT})
        });

        articles = articles
    })

    export const handleOpenKbArticle = (article: Article) => {
        isArticleModalOpen = true
        openArticleName = article.name + " - " + article.type
        
        window.electronAPI.readFile("./articles/guides/" + article.name + ".md").then((v) => {
            openArticleContent = v
        })
    }
</script>

<div class="file absolute left-0 right-0 top-0 bottom-0"/>
<div class="absolute left-0 bottom-0 m-2" style="width: 111px; height: 57px">
    <div class="logo h-full w-full"/>
</div>

<div class="flex flex-row w-full h-full mt-12 mb-4">
    <div class="flex flex-col w-full md:w-4/12 xl:w-3/12">
        <button class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" style="color: #4d4d4d; cursor: pointer" on:click={() => selectedTab = 0}>
            Knowledgebase
        </button>
        <button class="block mt-2 p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" style="color: #4d4d4d; cursor: pointer" on:click={() => selectedTab = 1}>
            Feedback
        </button>
    </div>
    <div class="flex flex-col w-full h-full md:w-8/12 xl:w-9/12 bg-stone-300 border border-gray-500 rounded-lg shadow-md ml-4">
        {#if selectedTab === 0}
        <div class="flex flex-row w-full mt-4 mx-4" style="font-size: 16px; color: #4d4d4d;">
            Articles
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 px-4 pt-2 overflow-auto" style="max-height: calc(100vh - 172px);">
            {#each articles as article}
                <button class="h-48 bg-stone-200 rounded-lg hover:bg-gray-100" style="font-size: 12px; color: #4d4d4d;" on:click={() => handleOpenKbArticle(article)}>
                    <div class="flex flex-row items-center">
                        <div class="flex flex-col h-full mx-auto">
                            <div class="icon pb-8">
                                {article.type === ArticleType.GUIDE ? 'school' : article.type === ArticleType.TROUBLESHOOT ? 'troubleshoot' : null}
                            </div>
                            <div>
                                {article.type}
                            </div>
                            <div>
                                {article.name}
                            </div>
                        </div>
                    </div>
                </button>
            {/each}
        </div>
        <!-- Modal -->
        <Modal bind:isOpen={isArticleModalOpen} label="Article" description={openArticleName} width={10} height={10}>
            <div class="px-3" style="font-size: 12px; color: #4d4d4d;">
                <SvelteMarkdown source={openArticleContent}/>
            </div>
        </Modal>
        {:else if selectedTab === 1}
        <div class="flex flex-col w-full h-full">
            <div class="flex flex-row w-full mt-4 mx-4" style="font-size: 16px; color: #4d4d4d;">
                Feedback
            </div>
            <div class="flex flex-col w-full h-full px-4 pt-8 items-center">
                <div class="flex flex-row items-center h-full w-full justify-center" style="font-size: 24px; color: #4d4d4d;">
                    Feedback can be reported through&nbsp;<a href=https://github.com/Revavix/simSUNDT3/issues class="text-blue-500" target="_blank"> GitHub</a>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>


<style>
    .logo {
        background-image: url("../assets/university_west_logo_small.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: -1;
    }
    .file {
        background-image: url("../assets/bg_help_tab.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-position-y: calc(center - 20px);
        z-index: -2;
    }
    .icon {
        font-family:'Material Icons'; 
        font-size:48px; 
        color:#4d4d4d
    }
    ::-webkit-scrollbar {
        width: 14px;
    }
    ::-webkit-scrollbar-track {
        background: #4d4d4d;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgb(231 229 228); 
        border-radius: 10px;
    }
</style>