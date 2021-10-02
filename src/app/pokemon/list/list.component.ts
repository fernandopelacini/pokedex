import { Component, OnInit, OnDestroy } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;

  subscriptions: Subscription[] = [];

  page:number=1;
  pageSize:number = 10;
  totalItems :number=898;

  constructor(private pokemonService: PokemonService) { }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    // if (!this.pokemons.length) {
      this.getPokemons();
    // }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  getType(pokemon: any): string {
    return this.pokemonService.getPokemonType(pokemon).map((x : string )=> `bg-${x.toLowerCase()}`)
    .join(' ');
  }

  onPageChanged(){
   this.getPokemons();
  }

  getPokemons(){
    let offset: number = this.page === 1 ? 0 : this.pageSize * (this.page - 1 );
    offset = offset >=898 ? 898 :offset;
    let take:number = offset >=890 ? 8 : this.pageSize; //LImit size of known pokemon since service doesn't return a total
    //is you retrieve more than 898 you get partil info from uknown pokemons.


    this.subscription= this.pokemonService.getNext( take,  offset).subscribe(
      x => {
        const details = x.results.map((i: any) => this.pokemonService.get(i.name));
        this.pokemonService.pokemons=[];

        this.subscription = concat(...details).subscribe((response: any) => {
               this.pokemonService.pokemons.push(response);
       });
      }
    );
  }

}
