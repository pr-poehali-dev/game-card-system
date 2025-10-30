import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  description: string;
  photo: string;
}

interface GameCard {
  id: string;
  title: string;
  description: string;
  photo: string;
}

interface GameRound {
  id: string;
  chooserId: string;
  playerId: string;
  card1Id: string;
  card2Id: string;
  selectedCardId: string | null;
  timestamp: Date;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      name: 'Александр',
      description: 'Любит экстремальные виды спорта',
      photo: '🧑'
    },
    {
      id: '2',
      name: 'Мария',
      description: 'Творческая натура',
      photo: '👩'
    }
  ]);

  const [gameCards, setGameCards] = useState<GameCard[]>([
    {
      id: '1',
      title: 'Прыжок с парашютом',
      description: 'Экстремальное приключение в небе',
      photo: '🪂'
    },
    {
      id: '2',
      title: 'Музыкальный фестиваль',
      description: 'Три дня живой музыки',
      photo: '🎵'
    },
    {
      id: '3',
      title: 'Кулинарный мастер-класс',
      description: 'Учимся готовить изысканные блюда',
      photo: '👨‍🍳'
    },
    {
      id: '4',
      title: 'Путешествие в горы',
      description: 'Неделя в горах с палатками',
      photo: '⛰️'
    }
  ]);

  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [activeTab, setActiveTab] = useState('players');

  const [newPlayer, setNewPlayer] = useState({ name: '', description: '', photo: '🧑' });
  const [newCard, setNewCard] = useState({ title: '', description: '', photo: '🎯' });
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  const [gameState, setGameState] = useState<{
    chooser: Player | null;
    player: Player | null;
    card1: GameCard | null;
    card2: GameCard | null;
  }>({
    chooser: null,
    player: null,
    card1: null,
    card2: null
  });

  const addPlayer = () => {
    if (!newPlayer.name.trim()) {
      toast.error('Введите имя игрока');
      return;
    }
    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      description: newPlayer.description,
      photo: newPlayer.photo
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '', description: '', photo: '🧑' });
    setIsPlayerDialogOpen(false);
    toast.success('Игрок добавлен!');
  };

  const addCard = () => {
    if (!newCard.title.trim()) {
      toast.error('Введите название карточки');
      return;
    }
    const card: GameCard = {
      id: Date.now().toString(),
      title: newCard.title,
      description: newCard.description,
      photo: newCard.photo
    };
    setGameCards([...gameCards, card]);
    setNewCard({ title: '', description: '', photo: '🎯' });
    setIsCardDialogOpen(false);
    toast.success('Карточка добавлена!');
  };

  const startNewGame = (chooser: Player, player: Player, card1: GameCard, card2: GameCard) => {
    setGameState({ chooser, player, card1, card2 });
    setActiveTab('game');
  };

  const makeChoice = (selectedCard: GameCard) => {
    if (!gameState.chooser || !gameState.player || !gameState.card1 || !gameState.card2) return;

    const round: GameRound = {
      id: Date.now().toString(),
      chooserId: gameState.chooser.id,
      playerId: gameState.player.id,
      card1Id: gameState.card1.id,
      card2Id: gameState.card2.id,
      selectedCardId: selectedCard.id,
      timestamp: new Date()
    };

    setGameRounds([round, ...gameRounds]);
    toast.success(`${gameState.player.name} выбрал: ${selectedCard.title}`);
    setGameState({ chooser: null, player: null, card1: null, card2: null });
    setActiveTab('history');
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);
  const getCardById = (id: string) => gameCards.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Е100%
          </h1>
          <p className="text-lg text-muted-foreground">Игра выбора и предпочтений</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto h-auto">
            <TabsTrigger value="players" className="flex flex-col gap-1 py-3">
              <Icon name="Users" size={20} />
              <span className="text-xs">Игроки</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex flex-col gap-1 py-3">
              <Icon name="Grid3x3" size={20} />
              <span className="text-xs">Карточки</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex flex-col gap-1 py-3">
              <Icon name="Play" size={20} />
              <span className="text-xs">Новая игра</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col gap-1 py-3">
              <Icon name="History" size={20} />
              <span className="text-xs">История</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col gap-1 py-3">
              <Icon name="BarChart3" size={20} />
              <span className="text-xs">Статистика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Участники игры</h2>
              <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить игрока
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новый игрок</DialogTitle>
                    <DialogDescription>Добавьте участника в игру</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="player-name">Имя</Label>
                      <Input
                        id="player-name"
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="player-desc">Описание</Label>
                      <Textarea
                        id="player-desc"
                        value={newPlayer.description}
                        onChange={(e) => setNewPlayer({ ...newPlayer, description: e.target.value })}
                        placeholder="Краткое описание игрока"
                      />
                    </div>
                    <div>
                      <Label htmlFor="player-photo">Эмодзи</Label>
                      <Input
                        id="player-photo"
                        value={newPlayer.photo}
                        onChange={(e) => setNewPlayer({ ...newPlayer, photo: e.target.value })}
                        placeholder="🧑"
                        maxLength={2}
                      />
                    </div>
                    <Button onClick={addPlayer} className="w-full">Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <Card key={player.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="text-5xl mb-2">{player.photo}</div>
                    <CardTitle>{player.name}</CardTitle>
                    <CardDescription>{player.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cards" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Библиотека карточек</h2>
              <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить карточку
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая карточка</DialogTitle>
                    <DialogDescription>Добавьте карточку для игры</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-title">Название</Label>
                      <Input
                        id="card-title"
                        value={newCard.title}
                        onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                        placeholder="Название карточки"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-desc">Описание</Label>
                      <Textarea
                        id="card-desc"
                        value={newCard.description}
                        onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                        placeholder="Описание карточки"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-photo">Эмодзи</Label>
                      <Input
                        id="card-photo"
                        value={newCard.photo}
                        onChange={(e) => setNewCard({ ...newCard, photo: e.target.value })}
                        placeholder="🎯"
                        maxLength={2}
                      />
                    </div>
                    <Button onClick={addCard} className="w-full">Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gameCards.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="text-5xl mb-2">{card.photo}</div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="text-sm">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="game" className="animate-fade-in">
            {!gameState.chooser ? (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Создать новый раунд</CardTitle>
                  <CardDescription>Выберите игроков и карточки для игры</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Кто выбирает карточки?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {players.map((player) => (
                        <Button
                          key={player.id}
                          variant={gameState.chooser?.id === player.id ? 'default' : 'outline'}
                          onClick={() => setGameState({ ...gameState, chooser: player })}
                          className="h-auto py-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">{player.photo}</span>
                            <span>{player.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {gameState.chooser && (
                    <div>
                      <Label className="text-base mb-3 block">Для кого выбираем?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {players.filter(p => p.id !== gameState.chooser?.id).map((player) => (
                          <Button
                            key={player.id}
                            variant={gameState.player?.id === player.id ? 'default' : 'outline'}
                            onClick={() => setGameState({ ...gameState, player })}
                            className="h-auto py-4"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-3xl">{player.photo}</span>
                              <span>{player.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {gameState.player && (
                    <>
                      <div>
                        <Label className="text-base mb-3 block">Первая карточка</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {gameCards.map((card) => (
                            <Button
                              key={card.id}
                              variant={gameState.card1?.id === card.id ? 'default' : 'outline'}
                              onClick={() => setGameState({ ...gameState, card1: card })}
                              className="h-auto py-4"
                              disabled={gameState.card2?.id === card.id}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-3xl">{card.photo}</span>
                                <span className="text-sm">{card.title}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {gameState.card1 && (
                        <div>
                          <Label className="text-base mb-3 block">Вторая карточка</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {gameCards.map((card) => (
                              <Button
                                key={card.id}
                                variant={gameState.card2?.id === card.id ? 'default' : 'outline'}
                                onClick={() => setGameState({ ...gameState, card2: card })}
                                className="h-auto py-4"
                                disabled={gameState.card1?.id === card.id}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-3xl">{card.photo}</span>
                                  <span className="text-sm">{card.title}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {gameState.card2 && (
                    <Button
                      onClick={() => startNewGame(gameState.chooser!, gameState.player!, gameState.card1!, gameState.card2!)}
                      className="w-full"
                      size="lg"
                    >
                      Начать раунд
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {gameState.chooser.name} выбрал для {gameState.player?.name}
                    </CardTitle>
                    <CardDescription>Что выберет {gameState.player?.name}?</CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all border-4 hover:border-primary"
                    onClick={() => makeChoice(gameState.card1!)}
                  >
                    <CardHeader className="text-center">
                      <div className="text-8xl mb-4">{gameState.card1?.photo}</div>
                      <CardTitle className="text-2xl">{gameState.card1?.title}</CardTitle>
                      <CardDescription className="text-base">{gameState.card1?.description}</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all border-4 hover:border-primary"
                    onClick={() => makeChoice(gameState.card2!)}
                  >
                    <CardHeader className="text-center">
                      <div className="text-8xl mb-4">{gameState.card2?.photo}</div>
                      <CardTitle className="text-2xl">{gameState.card2?.title}</CardTitle>
                      <CardDescription className="text-base">{gameState.card2?.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setGameState({ chooser: null, player: null, card1: null, card2: null })}
                  className="w-full"
                >
                  Отменить раунд
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">История игр</h2>
            {gameRounds.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="History" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет сыгранных раундов</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {gameRounds.map((round) => {
                  const chooser = getPlayerById(round.chooserId);
                  const player = getPlayerById(round.playerId);
                  const card1 = getCardById(round.card1Id);
                  const card2 = getCardById(round.card2Id);
                  const selected = getCardById(round.selectedCardId!);

                  return (
                    <Card key={round.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">
                              {chooser?.photo} {chooser?.name} → {player?.photo} {player?.name}
                            </CardTitle>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{card1?.photo} {card1?.title}</span>
                              <span>или</span>
                              <span>{card2?.photo} {card2?.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                              <Icon name="CheckCircle" size={16} />
                              <span>Выбор: {selected?.photo} {selected?.title}</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {round.timestamp.toLocaleString('ru-RU')}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Популярные карточки</CardTitle>
                  <CardDescription>Какие карточки выбирают чаще всего</CardDescription>
                </CardHeader>
                <CardContent>
                  {gameRounds.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Пока нет данных</p>
                  ) : (
                    <div className="space-y-3">
                      {(() => {
                        const cardCounts = gameRounds.reduce((acc, round) => {
                          const cardId = round.selectedCardId;
                          if (cardId) acc[cardId] = (acc[cardId] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        return Object.entries(cardCounts)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([cardId, count]) => {
                            const card = getCardById(cardId);
                            return (
                              <div key={cardId} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{card?.photo}</span>
                                  <span>{card?.title}</span>
                                </div>
                                <span className="font-semibold">{count}x</span>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Активность игроков</CardTitle>
                  <CardDescription>Кто участвовал в играх</CardDescription>
                </CardHeader>
                <CardContent>
                  {gameRounds.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Пока нет данных</p>
                  ) : (
                    <div className="space-y-3">
                      {(() => {
                        const playerCounts = gameRounds.reduce((acc, round) => {
                          acc[round.playerId] = (acc[round.playerId] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        return Object.entries(playerCounts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([playerId, count]) => {
                            const player = getPlayerById(playerId);
                            return (
                              <div key={playerId} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{player?.photo}</span>
                                  <span>{player?.name}</span>
                                </div>
                                <span className="font-semibold">{count} игр</span>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Общая статистика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{players.length}</div>
                      <div className="text-sm text-muted-foreground">Игроков</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{gameCards.length}</div>
                      <div className="text-sm text-muted-foreground">Карточек</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{gameRounds.length}</div>
                      <div className="text-sm text-muted-foreground">Раундов сыграно</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {gameRounds.length > 0 ? Math.round((gameRounds.length / (players.length * gameCards.length)) * 100) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Активность</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
