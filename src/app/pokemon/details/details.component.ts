import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, throwError  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  pokemon: any = null;
  pokemonType:string='';
  abilityDescription:string='';
  subscriptions: Subscription[] = [];


  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {

      if (this.pokemonService.pokemons.length) {
        this.pokemon = this.pokemonService.pokemons.find(i => i.name === params.name);
        if (this.pokemon) {
          this.pokemonType= this.pokemon.types.length > 0 ? this.pokemon.types.map((x:any) => x.type.name) : []; //select default pokemon type for card color.
          this.getEvolution();
          // this.getAbilityDescription();
          return;
        }
      }

      this.subscription = this.pokemonService.get(params.name).subscribe(response => {
        this.pokemon = response;
        this.getEvolution();
        // this.getAbilityDescription();
      }, error => console.log('Error occurred while retrieving data: ', error));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  getEvolution() {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.subscription = this.pokemonService.getPokemonSpecies(this.pokemon.name).subscribe(response => {
        const id = this.getId(response.evolution_chain.url);
        this.subscription = this.pokemonService.getPokemonEvolution(id).subscribe(response => this.getEvolves(response.chain));
      });
    }
  }


  getEvolves(chain: any) {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });

    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getType(pokemon: any): string[] {
    return this.pokemonService.getPokemonType(pokemon);
  }

  formatStat(stat:number): string
  {
   if(stat >= 80) return 'success';
   if(stat >= 50 && stat < 80) return 'warning';
   return 'danger';
  }

  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }

  getAbilityDescription(){
    this.abilityDescription = '';
    this.subscription = this.pokemonService.getAbilityDescription(this.getId(this.pokemon.abilities.ability.url)).subscribe(response => {
      this.pokemon.abilities.ability.description.push(response.effect_entries[0].short_effect);
      });
    }

  private handleError(err: HttpErrorResponse)
    {
      let errormessage = '';
      if (err.error instanceof ErrorEvent)
      {
          //Client side
          errormessage = `An error ocurred: ${err.error.message}` ;
      }
      else
      {
          //Backend error, return unsuccesfull error code.
          errormessage = `Server retured code: ${err.status}, error message is ${err.message}`
      }
        console.error(errormessage);
        return throwError(errormessage);
    }

}
