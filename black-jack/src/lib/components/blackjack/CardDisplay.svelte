<script lang="ts">
    export let image: string;
    export let code: string;
    export let index: number;
</script>

<div class="card" style="left: {index * 30}px">
    <img src={image} alt={code} />
</div>

<style>
    .card {
        position: absolute;
        transition: left 0.3s ease;
    }

    .card img {
        width: 100px;
        height: auto;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
</style>