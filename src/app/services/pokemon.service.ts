import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  //TODO: Create a strongly type interface to return a IPokemon instead of any
private url:string =environment.baseApiURL + 'pokemon/';
private _pokemonsList: any[] = [];
  private _next: string = '';

  constructor(private http: HttpClient) {  }

  get pokemons(): any[] {
    return this._pokemonsList;
  }

  set pokemons(data: any[]){
    this._pokemonsList=data;
  }
  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }



  getPokemonType(pokemon: any): string[] {
    return pokemon && pokemon.types.length > 0 ? pokemon.types.map((x:any) => x.type.name) : [];
  }

  get(name: string): Observable<any> {
    const url = `${this.url}${name}`;
    return this.http.get<any>(url);
  }

  getNext(limit:number, offset:number): Observable<any> {

    const url = this.next === '' ? `${this.url}?limit=${limit}&offset=${offset}` : this.next;
    return this.http.get<any>(url);
  }

  getPokemonEvolution(id: number): Observable<any> {
    const url = `${environment.baseApiURL}evolution-chain/${id}`;
    return this.http.get<any>(url);
  }

  getPokemonSpecies(name: string): Observable<any> {
    const url = `${environment.baseApiURL}pokemon-species/${name}`;
    return this.http.get<any>(url);
  }


  getEvolutionImage(name:string):Observable<any>{
    return this.http.get<any>(`${this.url}${name}`);
  }

  getAbilityDescription(id:number):Observable<any>{
    let result =  this.http.get<any>(`${environment.baseApiURL}ability/${id}`);
    return result;
  }

}
