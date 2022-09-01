import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { GamePlatformService } from 'src/app/services/game-platform.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string = 'added';
  protected search: boolean;
  private currentSort: string = '';
  public defaultOrder: string;
  public reverseOrder: string;
  protected selectedOrder: string = 'default';
  public games: Game[] = [];
  private routeSub!: Subscription;
  private gameSub!: Subscription;
  public orderPossibilities: string[][] = [
    ['Name', 'name', 'von A bis Z', 'von Z bis A'],
    ['Erscheinungsdatum', 'released', 'von alt nach neu', 'von neu nach alt'],
    [
      'Hinzugefügt',
      'added',
      'von Neustes bis Ältestes',
      'von Ältestes bis Neustes',
    ],
    [
      'Erstellt',
      'created',
      'von Neustes bis Ältestes',
      'von Ältestes bis Neustes',
    ],
    [
      'Aktualisiert',
      'updated',
      'von Neustes bis Ältestes',
      'von Ältestes bis Neustes',
    ],
    [
      'Bewertung',
      'rating',
      'von beste bis schlechteste',
      'von schlechteste bis beste',
    ],
    [
      'Metakritik',
      'metacritic',
      'von beste bis schlechteste',
      'von schlechteste bis beste',
    ],
  ];
  loading$ = this.loader.loading$;

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    protected gamePlatformService: GamePlatformService,
    protected sanitizer: DomSanitizer,
    private router: Router,
    public loader: LoadingService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      if (params['game-search']) {
        this.searchGames(params['game-search']);
        this.search = true;
      } else {
        this.setOrderSelectorText();
        this.getGames('Init');
        this.search = false;
      }
    });
  }

  getGames(trigger: string): void {
    this.setOrderSelectorText();

    if (this.sortStringBuilder() != this.currentSort) {
      this.currentSort = this.sortStringBuilder();
      this.gameSub = this.httpService
        .getGameList(this.currentSort)
        .subscribe((gameList: APIResponse<Game>) => {
          this.games = gameList.results;
          console.log(gameList);
          console.log(this.games);
        });
    }
  }

  searchGames(search: string): void {
    this.gameSub = this.httpService
      .getSearchResultGameList(search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        console.log(gameList);
        console.log(this.games);
      });
  }

  sortStringBuilder(): string {
    if (this.selectedOrder == 'reverse') {
      return '-' + this.sort;
    } else {
      return this.sort;
    }
  }

  getIcon(platform: string): string {
    return this.gamePlatformService.getIcon(platform);
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  setOrderSelectorText(): void {
    this.orderPossibilities.forEach((element) => {
      if (element[1] == this.sort) {
        this.defaultOrder = element[2];
        this.reverseOrder = element[3];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe;
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe;
    }
  }
}
