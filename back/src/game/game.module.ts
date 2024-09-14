import { Module } from "@nestjs/common";
import { GameGateway } from "./game.controller";
import { GameService } from "./game.service";

@Module({
  controllers: [GameGateway],
  providers: [GameService],
})
export class GoalsModule {}
