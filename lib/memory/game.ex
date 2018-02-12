defmodule Memory.Game do
  def newGame do
    %{
      blocks: generateBlocks(0),
      gameOver: false,
      clicks: 0,
      guess: -1,
      guessTwo: -1,
      progress: 0
    }
  end

  def client_view(game) do
    %{
      blocks: game.blocks,
      gameOver: game.gameOver,
      clicks: game.clicks,
      guess: game.guess,
      guessTwo: game.guessTwo,
      progress: game.progress
    }
  end

  # Handle a player guessing a block
  def guess(game, num) do
    cond do
      ((game.guessTwo != -1) || game.gameOver) -> # Either they are clicking while two tiles are already lit up, or game is already over
        game
      (game.guess == -1) -> # First guess
        newState = Map.put(game, :guess, num)
        Map.put(newState, :clicks, game.clicks + 1)
      (game.guess == num) -> # Clicking on square that has already been guessed
        game
      (Enum.at(game.blocks, num)[:letter] == Enum.at(game.blocks, game.guess)[:letter]) -> # Matching guess!
        newBlocks = completeBlock(game.blocks, num)
        newBlocks1 = completeBlock(newBlocks, game.guess)
        newState = Map.put(game, :blocks, newBlocks1)
        newStateProgress = Map.put(newState, :progress, game.progress + 12.5)
        newState1 = Map.put(newStateProgress, :clicks, game.clicks + 1)
        cond do
          checkGameOver(newState1.blocks, 0) -> # Check if game over
            gameOver = Map.put(newState1, :gameOver, true)
            resetGuesses(gameOver)
          true ->
            resetGuesses(newState1)
        end
      true -> # Incorrect Guess
        newState = Map.put(game, :guessTwo, num)
        newState1 = Map.put(newState, :clicks, game.clicks + 1)
        newState1
    end
  end

  # Returns the given list of blocks with the block at index "num" completed
  def completeBlock(blocks, num) do
    targetBlock = Enum.at(blocks, num)
    newBlock = Map.put(targetBlock, :completed, true)
    cond do 
      num == 0 ->
        Enum.concat([newBlock], Enum.slice(blocks, 1..16))
      true ->
        Enum.concat(Enum.concat(Enum.slice(blocks, 0..num-1), [newBlock]), Enum.slice(blocks, num+1..16))
    end
  end

  # Set guesses both back to -1
  def resetGuesses(game) do
    newState = Map.put(game, :guess, -1)
    Map.put(newState, :guessTwo, -1)
  end

  # Check if game has been won
  def checkGameOver(blocks, x) do
    cond do
      x == 16 ->
        true
      Enum.at(blocks, x)[:completed] ->
        checkGameOver(blocks, x+1)
      true ->
        false
    end
  end

  # Start case for generating randomized list of blocks
  def generateBlocks(0) do
    chars = Enum.slice(String.split("AABBCCDDEEFFGGHH", ""), 0..15)
    blocks = []
    generateBlocks(0, blocks, chars)
  end
  
  # End case, return list of blocks
  def generateBlocks(16, blocks, chars) do
    blocks
  end

  # Iterate through and randomly assign letters to blocks
  def generateBlocks(x, blocks, chars) do
    randomLetter = Enum.random(chars)
    index = Enum.find_index(chars, fn(y) -> y == randomLetter end)
    last = Enum.count(chars) - 1
    newChars = cond do
      index == 0 ->
        Enum.slice(chars, 1..last)
      index == last ->
        Enum.slice(chars, 0..last-1)
      true ->
        Enum.concat([Enum.slice(chars, 0..index-1), Enum.slice(chars, index+1..last)])
    end
    newBlocks = Enum.concat(blocks, [%{ index: x, letter: randomLetter, completed: false }])
    generateBlocks(x+1, newBlocks, newChars)
  end

end