import { IRSSArticleItem } from "~/lib/parser";
import './ArticleVoce.css';

export default function Voce(params: {articolo: IRSSArticleItem}) {
    return (
        <div class="articolo voce">
            <div>
                <div class="thumbnail" style={params.articolo.image ? {"background-image": `url("${params.articolo.image}")`} : {}}></div>
            </div>
            <div class=""><b>{params.articolo.title}</b></div>
        </div>
    )
}