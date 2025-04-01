// Game state types
export type Card = {
    image: string;
    value: string;
    suit: string;
    code: string;
};

export type GameStatus = 
    | 'initializing' 
    | 'playing' 
    | 'playerBust' 
    | 'dealerBust' 
    | 'playerBlackjack' 
    | 'dealerBlackjack' 
    | 'playerWin' 
    | 'dealerWin' 
    | 'push';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

// Get a new shuffled deck
export async function getNewDeck(): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/new/shuffle/?deck_count=1`);
        const data = await response.json();
        
        if (data.success) {
            return data.deck_id;
        } else {
            throw new Error('Failed to get a new deck');
        }
    } catch (error) {
        console.error('Error getting new deck:', error);
        throw error;
    }
}

// Draw cards from the deck
export async function drawCards(deckId: string, count: number): Promise<Card[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/${deckId}/draw/?count=${count}`);
        const data = await response.json();
        
        if (data.success) {
            return data.cards;
        } else {
            throw new Error('Failed to draw cards');
        }
    } catch (error) {
        console.error('Error drawing cards:', error);
        throw error;
    }
}

// Calculate the score of a hand
export function calculateScore(hand: Card[]): number {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === 'ACE') {
            aces += 1;
            score += 11;
        } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    // Adjust for aces if the score is over 21
    while (score > 21 && aces > 0) {
        score -= 10; // Count an ace as 1 instead of 11
        aces -= 1;
    }

    return score;
}

// Get status message based on game status
export function getStatusMessage(gameStatus: GameStatus): string {
    switch (gameStatus) {
        case 'initializing':
            return 'Préparation du jeu...';
        case 'playing':
            return 'Votre tour - Tirer ou rester?';
        case 'playerBust':
            return 'Vous avez dépassé 21. Vous perdez!';
        case 'dealerBust':
            return 'Le croupier a dépassé 21. Vous gagnez!';
        case 'playerBlackjack':
            return 'Blackjack! Vous gagnez!';
        case 'dealerBlackjack':
            return 'Le croupier a un Blackjack. Vous perdez!';
        case 'playerWin':
            return 'Vous gagnez!';
        case 'dealerWin':
            return 'Le croupier gagne!';
        case 'push':
            return 'Égalité!';
        default:
            return '';
    }
}