<script>
    import { kernelProgress } from '../lib/data/Stores';

    let progress = 0
    let finished = false

    kernelProgress.subscribe(v => {
        if (v === undefined) return

        try {
            finished = v[0].finished;
            progress = v[0].progress;
        } catch (e) {
            
        }
    })

    // Watch the progress variable and reset to 0 after 5 seconds if it's 1, but cancel if the progress is already below 1
    $: {
        if (finished) {
            setTimeout(() => {
                if (finished) {
                    progress = 0
                }
            }, 5000)
        }
    }
    
</script>

<div class="flex flex-col bg-base-100 rounded-lg shadow-lg w-full h-full" style="z-index: 4;">
    <div class="flex px-2 pt-1 text-base-content">
        <div class="flex flex-col">
            Progress ({finished ? "Finished" : Math.round(progress * 100) + "%"})
        </div>
    </div>
    <div class="flex flex-col my-auto w-full pt-1"> 
        <div class="w-full h-4 mb-4 rounded-full px-2">
            <progress class="progress {finished ? 'progress-success' : 'progress-primary'} h-4 w-full rounded-full" value={progress} max="1"/>
        </div>
    </div>
</div>