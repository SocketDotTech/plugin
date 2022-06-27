import { useRoutes } from "../../hooks/apis"
import { useSelector } from "react-redux"

export const RouteDetails = () => {
    const sourceChainId = useSelector((state:any) => state.networks.sourceChainId)
    const destChainId = useSelector((state:any) => state.networks.destChainId)
    const sourceToken = useSelector((state: any) => state.tokens.sourceToken)
    const destToken = useSelector((state: any) => state.tokens.destToken)
    const sourceAmount = useSelector((state:any) => state.amount.sourceAmount);
    useRoutes(sourceToken, destToken, sourceAmount, 'output');
    const quotes = useSelector((state: any) => state.quotes.allQuotes);
    const toAmount = quotes?.[0]?.route?.toAmount;
    return (
        <div>
            Source Chain - {sourceChainId} <br />
            Dest Chain - {destChainId} <br />
            From Token - {sourceToken?.symbol}<br />
            Dest Token - {destToken?.symbol}<br />
            amount - {sourceAmount}<br />
            toAmount - {toAmount}
        </div>
    )
}