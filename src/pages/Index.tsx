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
  city: string;
  age: string;
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
      title: 'Александра',
      city: 'Москва',
      age: '25',
      photo: '👩'
    },
    {
      id: '2',
      title: 'Дмитрий',
      city: 'Санкт-Петербург',
      age: '28',
      photo: '🧑'
    },
    {
      id: '3',
      title: 'Екатерина',
      city: 'Казань',
      age: '23',
      photo: '👩'
    },
    {
      id: '4',
      title: 'Михаил',
      city: 'Новосибирск',
      age: '30',
      photo: '👨'
    }
  ]);

  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [activeTab, setActiveTab] = useState('players');

  const [newPlayer, setNewPlayer] = useState({ name: '', description: '', photo: '🧑' });
  const [newCard, setNewCard] = useState({ title: '', city: '', age: '', photo: '🎯' });
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditPlayerDialogOpen, setIsEditPlayerDialogOpen] = useState(false);
  const [photoInput, setPhotoInput] = useState('');
  const [editingCard, setEditingCard] = useState<GameCard | null>(null);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);
  const [cardPhotoInput, setCardPhotoInput] = useState('');
  const [viewingCard, setViewingCard] = useState<GameCard | null>(null);
  const [isViewCardDialogOpen, setIsViewCardDialogOpen] = useState(false);

  const [gameState, setGameState] = useState<{
    chooser: Player | null;
    player: Player | null;
    card1: GameCard | null;
    card2: GameCard | null;
    step: 'chooser' | 'player' | 'selectCards' | 'makeChoice';
  }>({
    chooser: null,
    player: null,
    card1: null,
    card2: null,
    step: 'chooser'
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

  const openEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPhotoInput(player.photo);
    setIsEditPlayerDialogOpen(true);
  };

  const updatePlayer = () => {
    if (!editingPlayer) return;
    if (!editingPlayer.name.trim()) {
      toast.error('Введите имя игрока');
      return;
    }
    setPlayers(players.map(p => p.id === editingPlayer.id ? editingPlayer : p));
    setIsEditPlayerDialogOpen(false);
    setEditingPlayer(null);
    setPhotoInput('');
    toast.success('Игрок обновлён!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (editingPlayer) {
        setEditingPlayer({ ...editingPlayer, photo: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCardPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (editingCard) {
        setEditingCard({ ...editingCard, photo: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const addCard = () => {
    if (!newCard.title.trim()) {
      toast.error('Введите имя');
      return;
    }
    const card: GameCard = {
      id: Date.now().toString(),
      title: newCard.title,
      city: newCard.city,
      age: newCard.age,
      photo: newCard.photo
    };
    setGameCards([...gameCards, card]);
    setNewCard({ title: '', city: '', age: '', photo: '🎯' });
    setIsCardDialogOpen(false);
    toast.success('Карточка добавлена!');
  };

  const openEditCard = (card: GameCard) => {
    setEditingCard(card);
    setCardPhotoInput(card.photo);
    setIsEditCardDialogOpen(true);
  };

  const updateCard = () => {
    if (!editingCard) return;
    if (!editingCard.title.trim()) {
      toast.error('Введите имя');
      return;
    }
    setGameCards(gameCards.map(c => c.id === editingCard.id ? editingCard : c));
    setIsEditCardDialogOpen(false);
    setEditingCard(null);
    setCardPhotoInput('');
    toast.success('Карточка обновлена!');
  };

  const openViewCard = (card: GameCard) => {
    setViewingCard(card);
    setIsViewCardDialogOpen(true);
  };

  const startCardSelection = () => {
    if (!gameState.chooser || !gameState.player) return;
    setGameState({ ...gameState, step: 'selectCards' });
  };

  const confirmCardSelection = () => {
    if (!gameState.card1 || !gameState.card2) return;
    setGameState({ ...gameState, step: 'makeChoice' });
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
    setGameState({ chooser: null, player: null, card1: null, card2: null, step: 'chooser' });
    setActiveTab('history');
  };

  const resetGame = () => {
    setGameState({ chooser: null, player: null, card1: null, card2: null, step: 'chooser' });
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
          <div className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto h-auto">
              <TabsTrigger value="players" className="flex flex-col gap-1 py-3">
                <Icon name="Users" size={20} />
                <span className="text-xs">Игроки</span>
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex flex-col gap-1 py-3">
                <Icon name="Grid3x3" size={20} />
                <span className="text-xs">Карточки</span>
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
            
            <Button
              onClick={() => setActiveTab('game')}
              className="w-full max-w-3xl mx-auto h-14 text-lg font-semibold"
              style={{ backgroundColor: '#FFD700', color: '#000' }}
            >
              <Icon name="Play" size={24} className="mr-2" />
              Новая игра
            </Button>
          </div>

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
                <Card key={player.id} className="hover:shadow-lg transition-all hover:-translate-y-1 group relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-5xl mb-2">
                          {player.photo.startsWith('data:') ? (
                            <img src={player.photo} alt={player.name} className="w-16 h-16 rounded-full object-cover" />
                          ) : (
                            player.photo
                          )}
                        </div>
                        <CardTitle>{player.name}</CardTitle>
                        <CardDescription>{player.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditPlayer(player)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Dialog open={isEditPlayerDialogOpen} onOpenChange={setIsEditPlayerDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать игрока</DialogTitle>
                  <DialogDescription>Измените данные участника</DialogDescription>
                </DialogHeader>
                {editingPlayer && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-player-name">Имя</Label>
                      <Input
                        id="edit-player-name"
                        value={editingPlayer.name}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-player-desc">Описание</Label>
                      <Textarea
                        id="edit-player-desc"
                        value={editingPlayer.description}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, description: e.target.value })}
                        placeholder="Краткое описание игрока"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-player-photo">Фото</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">
                            {editingPlayer.photo.startsWith('data:') ? (
                              <img src={editingPlayer.photo} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                              editingPlayer.photo
                            )}
                          </div>
                          <Input
                            id="edit-player-photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground">или</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <Input
                          value={photoInput}
                          onChange={(e) => {
                            setPhotoInput(e.target.value);
                            setEditingPlayer({ ...editingPlayer, photo: e.target.value });
                          }}
                          placeholder="Введите эмодзи 🧑"
                          maxLength={2}
                        />
                      </div>
                    </div>
                    <Button onClick={updatePlayer} className="w-full">Сохранить</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
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
                      <Label htmlFor="card-title">Имя</Label>
                      <Input
                        id="card-title"
                        value={newCard.title}
                        onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-city">Город</Label>
                      <Input
                        id="card-city"
                        value={newCard.city}
                        onChange={(e) => setNewCard({ ...newCard, city: e.target.value })}
                        placeholder="Введите город"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-age">Возраст</Label>
                      <Input
                        id="card-age"
                        value={newCard.age}
                        onChange={(e) => setNewCard({ ...newCard, age: e.target.value })}
                        placeholder="Введите возраст"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-photo">Эмодзи или фото</Label>
                      <Input
                        id="card-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewCard({ ...newCard, photo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <Button onClick={addCard} className="w-full">Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gameCards.map((card) => (
                <Card 
                  key={card.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group relative cursor-pointer h-80"
                  onClick={() => openViewCard(card)}
                >
                  <div className="relative h-full">
                    {card.photo.startsWith('data:') ? (
                      <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-8xl">
                        {card.photo}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                      <p className="text-sm opacity-90 flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        {card.city}
                      </p>
                      <p className="text-sm opacity-90">{card.age} лет</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditCard(card);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Dialog open={isViewCardDialogOpen} onOpenChange={setIsViewCardDialogOpen}>
              <DialogContent className="max-w-md">
                {viewingCard && (
                  <div className="space-y-4">
                    <div className="relative h-96 -mx-6 -mt-6 mb-4">
                      {viewingCard.photo.startsWith('data:') ? (
                        <img src={viewingCard.photo} alt={viewingCard.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-9xl">
                          {viewingCard.photo}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">{viewingCard.title}</h2>
                        <p className="text-lg flex items-center gap-2">
                          <Icon name="MapPin" size={18} />
                          {viewingCard.city}
                        </p>
                        <p className="text-lg">{viewingCard.age} лет</p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={isEditCardDialogOpen} onOpenChange={setIsEditCardDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать карточку</DialogTitle>
                  <DialogDescription>Измените данные карточки</DialogDescription>
                </DialogHeader>
                {editingCard && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-card-title">Имя</Label>
                      <Input
                        id="edit-card-title"
                        value={editingCard.title}
                        onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-card-city">Город</Label>
                      <Input
                        id="edit-card-city"
                        value={editingCard.city}
                        onChange={(e) => setEditingCard({ ...editingCard, city: e.target.value })}
                        placeholder="Введите город"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-card-age">Возраст</Label>
                      <Input
                        id="edit-card-age"
                        value={editingCard.age}
                        onChange={(e) => setEditingCard({ ...editingCard, age: e.target.value })}
                        placeholder="Введите возраст"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-card-photo">Фото</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">
                            {editingCard.photo.startsWith('data:') ? (
                              <img src={editingCard.photo} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                            ) : (
                              editingCard.photo
                            )}
                          </div>
                          <Input
                            id="edit-card-photo"
                            type="file"
                            accept="image/*"
                            onChange={handleCardPhotoUpload}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground">или</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <Input
                          value={cardPhotoInput}
                          onChange={(e) => {
                            setCardPhotoInput(e.target.value);
                            setEditingCard({ ...editingCard, photo: e.target.value });
                          }}
                          placeholder="Введите эмодзи 🎯"
                          maxLength={2}
                        />
                      </div>
                    </div>
                    <Button onClick={updateCard} className="w-full">Сохранить</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="game" className="animate-fade-in">
            {gameState.step === 'chooser' && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Создать новый раунд</CardTitle>
                  <CardDescription>Кто выбирает игрока?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Выберите игрока</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {players.map((player) => (
                        <Button
                          key={player.id}
                          variant={gameState.chooser?.id === player.id ? 'default' : 'outline'}
                          onClick={() => setGameState({ ...gameState, chooser: player, step: 'player' })}
                          className="h-auto py-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">
                              {player.photo.startsWith('data:') ? (
                                <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                player.photo
                              )}
                            </span>
                            <span>{player.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {gameState.step === 'player' && gameState.chooser && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>{gameState.chooser.name} выбирает для кого?</CardTitle>
                  <CardDescription>Выберите игрока, который будет делать выбор</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Для кого выбираем?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {players.filter(p => p.id !== gameState.chooser?.id).map((player) => (
                        <Button
                          key={player.id}
                          variant={gameState.player?.id === player.id ? 'default' : 'outline'}
                          onClick={() => setGameState({ ...gameState, player, step: 'selectCards' })}
                          className="h-auto py-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">
                              {player.photo.startsWith('data:') ? (
                                <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                player.photo
                              )}
                            </span>
                            <span>{player.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" onClick={resetGame} className="w-full">
                    Назад
                  </Button>
                </CardContent>
              </Card>
            )}

            {gameState.step === 'selectCards' && gameState.chooser && gameState.player && (
              <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>{gameState.chooser.name} выбирает карточки для {gameState.player.name}</CardTitle>
                    <CardDescription>Выберите две карточки</CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <Card 
                    className={`h-80 ${gameState.card1 ? 'border-primary border-2' : 'border-dashed border-2'} cursor-pointer hover:shadow-lg transition-all`}
                  >
                    {gameState.card1 ? (
                      <div className="relative h-full" onClick={() => setGameState({ ...gameState, card1: null })}>
                        {gameState.card1.photo.startsWith('data:') ? (
                          <img src={gameState.card1.photo} alt={gameState.card1.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-8xl rounded-lg">
                            {gameState.card1.photo}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold">{gameState.card1.title}</h3>
                          <p className="text-sm flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {gameState.card1.city}
                          </p>
                          <p className="text-sm">{gameState.card1.age} лет</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Icon name="Plus" size={48} />
                        <p className="mt-2">Поле 1</p>
                      </div>
                    )}
                  </Card>

                  <div className="text-center">
                    <p className="text-3xl font-bold text-muted-foreground">ИЛИ</p>
                  </div>

                  <Card 
                    className={`h-80 ${gameState.card2 ? 'border-primary border-2' : 'border-dashed border-2'} cursor-pointer hover:shadow-lg transition-all`}
                  >
                    {gameState.card2 ? (
                      <div className="relative h-full" onClick={() => setGameState({ ...gameState, card2: null })}>
                        {gameState.card2.photo.startsWith('data:') ? (
                          <img src={gameState.card2.photo} alt={gameState.card2.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-8xl rounded-lg">
                            {gameState.card2.photo}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold">{gameState.card2.title}</h3>
                          <p className="text-sm flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {gameState.card2.city}
                          </p>
                          <p className="text-sm">{gameState.card2.age} лет</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Icon name="Plus" size={48} />
                        <p className="mt-2">Поле 2</p>
                      </div>
                    )}
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Выберите карточки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {gameCards.map((card) => (
                        <Card
                          key={card.id}
                          className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all h-60 ${
                            gameState.card1?.id === card.id || gameState.card2?.id === card.id ? 'opacity-50' : ''
                          }`}
                          onClick={() => {
                            if (gameState.card1?.id === card.id || gameState.card2?.id === card.id) return;
                            if (!gameState.card1) {
                              setGameState({ ...gameState, card1: card });
                            } else if (!gameState.card2) {
                              setGameState({ ...gameState, card2: card });
                            }
                          }}
                        >
                          <div className="relative h-full">
                            {card.photo.startsWith('data:') ? (
                              <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-6xl">
                                {card.photo}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <h3 className="text-sm font-bold">{card.title}</h3>
                              <p className="text-xs flex items-center gap-1">
                                <Icon name="MapPin" size={10} />
                                {card.city}
                              </p>
                              <p className="text-xs">{card.age} лет</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={resetGame} className="flex-1">
                    Отменить
                  </Button>
                  <Button 
                    onClick={confirmCardSelection} 
                    disabled={!gameState.card1 || !gameState.card2}
                    className="flex-1"
                    size="lg"
                  >
                    ОК
                  </Button>
                </div>
              </div>
            )}

            {gameState.step === 'makeChoice' && gameState.chooser && gameState.player && gameState.card1 && gameState.card2 && (
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
                    className="overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all border-4 hover:border-primary h-96"
                    onClick={() => makeChoice(gameState.card1!)}
                  >
                    <div className="relative h-full">
                      {gameState.card1.photo.startsWith('data:') ? (
                        <img src={gameState.card1.photo} alt={gameState.card1.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-9xl">
                          {gameState.card1.photo}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-3xl font-bold mb-2">{gameState.card1.title}</h3>
                        <p className="text-lg flex items-center gap-2">
                          <Icon name="MapPin" size={18} />
                          {gameState.card1.city}
                        </p>
                        <p className="text-lg">{gameState.card1.age} лет</p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all border-4 hover:border-primary h-96"
                    onClick={() => makeChoice(gameState.card2!)}
                  >
                    <div className="relative h-full">
                      {gameState.card2.photo.startsWith('data:') ? (
                        <img src={gameState.card2.photo} alt={gameState.card2.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 text-9xl">
                          {gameState.card2.photo}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-3xl font-bold mb-2">{gameState.card2.title}</h3>
                        <p className="text-lg flex items-center gap-2">
                          <Icon name="MapPin" size={18} />
                          {gameState.card2.city}
                        </p>
                        <p className="text-lg">{gameState.card2.age} лет</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Button
                  variant="outline"
                  onClick={resetGame}
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