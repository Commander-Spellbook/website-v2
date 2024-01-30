import {Template} from "lib/types";
import cardBack from "assets/images/card-back.png";
import TextWithMagicSymbol from "components/layout/TextWithMagicSymbol/TextWithMagicSymbol";
import {useEffect, useState} from "react";
import requestService from "services/request.service";
import Loader from "components/layout/Loader/Loader";
import ScryfallResultsModal from "components/combo/TemplateCard/ScryfallResultsModal/ScryfallResultsModal";
import { ScryfallCard } from "@scryfall/api-types";
import ScryfallResultsWheel from "components/combo/TemplateCard/ScryfallResultsWheel/ScryfallResultsWheel";

type Props = {
  template: Template
}

const TemplateCard = ({template}: Props) => {

  const [resultCount, setResultCount] = useState(0);
  const [results, setResults] = useState<ScryfallCard.Any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestService.get(template.template.scryfallApi)
      .then((response) => {
        setResultCount(response.total_cards);
        setResults(response.data);
      })
      .finally(() => setLoading(false))
  }, []);

  return (
    <div>
      <div className="rounded-xl relative" style={{backgroundColor: '#380a2d'}}>
        <div className="absolute -top-5 text-center w-full text-white font-bold text-[16px] p-7"><TextWithMagicSymbol text={template.template.name}/></div>
        <div className="absolute top-[60px] flex flex-col justify-center w-full items-center z-10">
          {loading ? <Loader/> : <ScryfallResultsWheel cards={results}/>}
        </div>
        <div className="absolute -bottom-1 flex flex-col justify-center w-full items-center">
          {/*<div className="text-center w-full font-bold italic text-gray-400">{loading ? <Loader/> : `${resultCount} legal cards`}</div>*/}
          <ScryfallResultsModal count={resultCount} scryfallApiUrl={template.template.scryfallApi}/>
        </div>
        <img className="opacity-10" src={cardBack.src} alt="MTG Card Back"/>
      </div>

    </div>
  )
}

export default TemplateCard;
